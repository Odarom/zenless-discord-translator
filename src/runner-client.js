import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { dirname } from 'node:path';
import { runnerInput, runnerMetadata } from './runner-broker.js';

export function runnerOrigin(value) {
  const url = new URL(value);
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash
    || (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)))) throw new Error('Use HTTPS for a remote bot');
  return url.origin;
}
export class RunnerClient {
  constructor(path, { fetcher = fetch } = {}) { this.path = path; this.fetcher = fetcher; }
  connection() {
    const data = JSON.parse(readFileSync(this.path, 'utf8'));
    if (!/^[a-f0-9]{64}$/.test(data.token || '')) throw new Error('Invalid runner connection');
    return { origin: runnerOrigin(data.origin), token: data.token };
  }
  async request(origin, route, body, credential) {
    const response = await this.fetcher(`${runnerOrigin(origin)}/api/runner/${route}`, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15000),
      headers: { 'Content-Type': 'application/json', ...(credential ? { Authorization: `Bearer ${credential}` } : {}) }, body: JSON.stringify(body) });
    if (!response.ok) throw new Error(`Runner connection failed (${response.status})`);
    const chunks = []; let size = 0;
    for await (const chunk of response.body) { size += chunk.length; if (size > 65536) throw new Error('Runner response too large'); chunks.push(chunk); }
    return JSON.parse(Buffer.concat(chunks));
  }
  async pair(origin, code, settings) {
    origin = runnerOrigin(origin);
    if (!/^[a-f0-9]{64}$/.test(code)) throw new Error('Invalid pairing code');
    const data = await this.request(origin, 'pair', { code, settings: runnerMetadata({ ...settings, translationModes: ['game', 'general'] }) });
    if (!/^[a-f0-9]{64}$/.test(data.token || '')) throw new Error('Invalid runner connection');
    mkdirSync(dirname(this.path), { recursive: true });
    const tmp = `${this.path}.tmp`; writeFileSync(tmp, JSON.stringify({ origin, token: data.token }), { mode: 0o600 }); renameSync(tmp, this.path);
  }
  async poll(settings) {
    const { origin, token } = this.connection();
    const data = await this.request(origin, 'poll', { settings: runnerMetadata({ ...settings, translationModes: ['game', 'general'] }) }, token);
    if (!data.job) return null;
    if (!/^[a-f0-9]{64}$/.test(data.job.id || '')) throw new Error('Invalid runner job');
    return { id: data.job.id, input: runnerInput(data.job.input) };
  }
  async complete(id, result) {
    const { origin, token } = this.connection(); return this.request(origin, 'complete', { id, ...result }, token);
  }
}
export function runnerFailure(error, elapsedMs) {
  // Never retain a provider body, exception message, job ID, key or chat text.
  const message = typeof error?.message === 'string' ? error.message : '';
  const http = /^(?:Gemini|AI) 요청 실패\(HTTP (\d{3})\)\./.exec(message);
  let category = 'unknown';
  if (message.startsWith('Gemini 사용 한도에 도달했습니다.')) category = 'api-rate-limit';
  else if (message.startsWith('오늘의 AI 요청 한도에 도달했습니다.')) category = 'local-daily-limit';
  else if (/^Gemini가 \d+초 안에 응답하지 않아/.test(message)) category = 'api-timeout';
  else if (message.startsWith('Gemini 연결이 끊겨') || message.startsWith('AI 연결이 지연되거나 끊겼습니다.')) category = 'api-connection';
  else if (message.startsWith('Gemini 서버가 일시적으로 요청을 처리하지 못했습니다(')) category = 'api-unavailable';
  else if (http) category = ['401', '403'].includes(http[1]) ? 'api-auth' : http[1] === '429' ? 'api-rate-limit' : 'api-request';
  else if (message.startsWith('Gemini가 번역을 완료하지 못했습니다.') || message.startsWith('AI 번역이 끝까지 생성되지 않았습니다.')) category = 'api-incomplete';
  else if (['AI가 유효한 번역을 반환하지 않았습니다.', 'Gemini 응답을 읽지 못했습니다.', 'AI 응답을 읽지 못했습니다.'].includes(message)) category = 'response-format';
  else if (message === '일부 언어의 번역이 없거나 너무 깁니다.') category = 'translation-missing';
  else if (message.startsWith('AI가 원문의 줄바꿈')) category = 'translation-layout';
  else if (message.startsWith('AI가 ') && message.includes('번역 대신 영문을 반환했습니다.')) category = 'translation-language';
  else if (error?.code === 'TRANSLATION_ATTRIBUTE_MISMATCH') category = 'translation-attribute';
  const diagnostic = { category, elapsedMs: Number.isFinite(elapsedMs) ? Math.max(0, Math.round(elapsedMs)) : 0 };
  if (http) diagnostic.httpStatus = Number(http[1]);
  if (['request', 'response'].includes(error?.phase)) diagnostic.phase = error.phase;
  return diagnostic;
}
export async function processRunnerJob(client, job, translator, { onFailure = () => {} } = {}) {
  // A completion retry reuses this result. It must never translate a second time.
  let result; const startedAt = performance.now();
  try { result = { output: await translator.translate(runnerInput(job.input)) }; }
  catch (error) {
    result = { error: true };
    try { onFailure(runnerFailure(error, performance.now() - startedAt)); } catch { /* Diagnostics must not prevent result delivery. */ }
  }
  for (let attempt = 0; attempt < 2; attempt++) {
    try { return await client.complete(job.id, result); } catch { if (attempt) throw new Error('Could not deliver runner result; translation was not repeated'); }
  }
}
