import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Collection, PermissionFlagsBits, PermissionsBitField } from 'discord.js';
import { Store } from '../src/store.js';
import { Translator } from '../src/translator.js';
import { Relay } from '../src/relay.js';
import { handleCommand } from '../src/discord.js';
import { command } from '../src/commands.js';
import { RunnerBroker, runnerInput, runnerMetadata } from '../src/runner-broker.js';
import { RunnerClient, processRunnerJob } from '../src/runner-client.js';

function setup(t) {
  const directory = mkdtempSync(join(tmpdir(), 'zzz-mode-'));
  const dispose = [];
  t.after(() => { for (const close of dispose) close(); rmSync(directory, {recursive: true, force: true}); });
  return { directory, dispose, store: new Store(join(directory, 'state.json')) };
}
const config = { provider: 'openai', model: 'test-model', apiKey: 'PRIVATE-KEY', dailyLimit: 5, timeoutMs: 1000, maxOutputTokens: 1000, style: 'community', contextMessages: 4, maxChars: 2000 };
const input = { text: 'Apple tastes good.', sourceLanguage: 'en', targets: ['ko'] };
const output = { ko: '사과가 맛있네요.' };
const metadata = { provider: 'openai', model: 'test-model', dailyLimit: 5 };
const supported = { ...metadata, translationModes: ['game', 'general'] };
const snapshot = { entries: [{ id: 'example:apple', preferred: { en: 'Apple', ko: '애플' }, aliases: ['Apple'], category: 'community', meaning: 'Private fixture', rule: 'Private fixture rule' }] };
const manager = (options, guild = {members: {fetchMe: async () => ({id: 'bot'})}}) => ({ guildId: 'one', guild, inGuild: () => true, memberPermissions: {has: () => true}, options });
const options = (subcommand, values = {}) => ({ getSubcommand: () => subcommand, getString: key => values[key], getChannel: () => values.channel });

test('general translation makes no glossary read or upload and uses an ordinary conversation prompt', async t => {
  const {directory, store} = setup(t), requests = [];
  const fetcher = async (_, request) => { requests.push(JSON.parse(request.body)); return Response.json({ status: 'completed', output: [{content: [{type: 'output_text', text: JSON.stringify(output)}]}], usage: {input_tokens: 2, output_tokens: 3} }); };
  const translator = new Translator(config, store.scoped('one'), join(directory, 'does-not-exist.json'), fetcher);
  assert.deepEqual(await translator.translate({...input, translationMode: 'general'}), output);
  const request = requests[0], payload = JSON.parse(request.input);
  assert(!Object.hasOwn(payload, 'glossary'));
  assert.match(request.instructions, /general Discord conversations/);
  assert(!/Zenless Zone Zero|EX Special Attack|partyInitialKo|Anomaly RES|gamer shorthand/.test(request.instructions));
  assert.equal(payload.message.text, input.text);
  assert.equal(store.scoped('one').usage().requests, 1);
  await assert.rejects(translator.translate({...input, translationMode: 'invalid'}), /지원하지 않는 번역 방식/);
  assert.equal(requests.length, 1);
});

test('omitting the mode still sends the game glossary and original game instructions', async t => {
  const {store} = setup(t); let request;
  const translator = new Translator(config, store.scoped('one'), 'unused', async (_, value) => {
    request = JSON.parse(value.body); return Response.json({status: 'completed', output: [{content: [{type: 'output_text', text: JSON.stringify(output)}]}]});
  }, snapshot);
  await translator.translate(input);
  assert.match(request.instructions, /Zenless Zone Zero/);
  assert.equal(JSON.parse(request.input).glossary[0].id, 'example:apple');
  assert.equal(JSON.parse(request.input).glossary[0].outputPreferred.ko, '애플');
});

test('mode changes persist for only the selected group and leave keys, links, paused state and other servers alone', async t => {
  const {store} = setup(t);
  for (const [guild, group, channel] of [['one','chat','ko'], ['one','guide','guide-ko'], ['two','chat','other-ko']]) store.link(guild, group, channel, 'ko', 'hook');
  const untouched = structuredClone(store.group('two', 'chat'));
  assert.equal(store.group('one','chat').translationMode ?? 'game', 'game');
  store.pause('one','chat',true); store.setTranslationMode('one','chat','general');
  const restored = new Store(store.path);
  assert.equal(restored.group('one','chat').translationMode, 'general');
  assert(restored.group('one','chat').paused); assert.equal(restored.group('one','chat').channels[0].id, 'ko');
  assert.equal(restored.group('one','guide').translationMode ?? 'game', 'game');
  assert.deepEqual(restored.group('two','chat'), untouched);
  assert.throws(() => store.setTranslationMode('one','missing','general'), /먼저 연결/);
  assert.throws(() => store.setTranslationMode('one','chat','invalid'), /게임 번역/);
  store.setTranslationMode('one','chat','game'); assert.equal(store.group('one','chat').translationMode, 'game');
});

test('mode command requires management rights, refuses old runners and clears only the selected history', async t => {
  const {store} = setup(t); store.link('one','chat','ko','ko','hook');
  const forgotten = [], deps = { store, relay: {forgetGroup: key => forgotten.push(key)}, broker: {status: () => metadata} };
  const interaction = manager(options('mode',{group: 'chat',mode: 'general'}));
  await assert.rejects(handleCommand({...interaction,memberPermissions:{has:()=>false}},deps), /권한/);
  await assert.rejects(handleCommand(interaction,deps), /업데이트/);
  assert.equal(store.group('one','chat').translationMode ?? 'game', 'game');
  deps.broker.status = () => supported;
  assert.match(await handleCommand(interaction,deps), /다음 새 메시지/);
  assert.deepEqual(forgotten, ['one:chat']);
  assert.match(await handleCommand(manager(options('status')),deps), /일반 번역/);
});

test('relay sends the chosen mode, clears old context on switching and preserves old message edit mode', async t => {
  const {store} = setup(t), requests = [];
  store.link('one','chat','ko','ko','hook-ko'); store.link('one','chat','en','en','hook-en');
  const relay = new Relay({store,config,translator: {translate: async value => {requests.push(value); return {en:'Hello'};}},transport:{send:async()=>({id:'copy'}),edit:async()=>{}},reviewInfo:()=>({style:'community',glossaryHash:'a'.repeat(64)})});
  const message = id => ({id,channelId:'ko',guildId:'one',content:'안녕하세요',author:{id:'speaker',username:'user',bot:false,displayAvatarURL:()=>''},member:{displayName:'user'}});
  await relay.handle(message('old')); assert.equal(requests[0].translationMode, 'game');
  await handleCommand(manager(options('mode',{group:'chat',mode:'general'})),{store,relay});
  await relay.handle(message('new'));
  assert.equal(requests[1].translationMode,'general'); assert.deepEqual(requests[1].context,[]);
  assert.equal(store.record('new').translationMode, 'general');
  assert.equal(store.record('new').copies.en.review.style, 'general');
  assert(!Object.hasOwn(store.record('new').copies.en.review,'glossaryHash'));
  await relay.handle({...message('old'),content:'수정된 인사'}, {edited:true});
  assert.equal(requests[2].translationMode,'game');
});

test('broker keeps general mode through delivery and blocks old or downgraded workers', async t => {
  const {directory,dispose} = setup(t), broker = new RunnerBroker(join(directory,'broker.sqlite'));
  dispose.push(()=>broker.close()); broker.pair(broker.code('one'),metadata); broker.poll('one',metadata);
  await assert.rejects(broker.translate('one',{...input,translationMode:'general'}), /업데이트/);
  assert.equal(broker.jobs.size,0);
  const legacy = broker.translate('one',input), legacyJob = broker.poll('one',metadata);
  broker.complete('one',{id:legacyJob.id,output}); assert.deepEqual(await legacy,output);
  broker.poll('one',supported);
  const pending = broker.translate('one',{...input,translationMode:'general'}), job = broker.poll('one',supported);
  let calls=0;
  await processRunnerJob({complete:async(id,result)=>broker.complete('one',{id,...result})},job,{translate:async value=>{calls++;assert.equal(value.translationMode,'general');return output;}});
  assert.deepEqual(await pending,output); assert.equal(calls,1);
  const downgrade = broker.translate('one',{...input,translationMode:'general'}), rejection=assert.rejects(downgrade,/업데이트/);
  assert.equal(broker.poll('one',metadata),null); await rejection; assert.equal(broker.jobs.size,0);
  assert.throws(()=>runnerInput({...input,translationMode:'bad'}),/mode/);
  assert(!Object.hasOwn(runnerMetadata({...metadata,translationModes:['bad']}),'translationModes'));
});

test('runner advertises support on pairing and polling without publishing the API key', async t => {
  const {directory}=setup(t), requests=[], token='a'.repeat(64);
  const client=new RunnerClient(join(directory,'connection.json'),{fetcher:async(url,request)=>{const body=JSON.parse(request.body);requests.push(body);return Response.json(url.endsWith('/pair')?{token}:{job:null});}});
  await client.pair('https://example.test','b'.repeat(64),{...metadata,apiKey:'PRIVATE-KEY'});
  await client.poll({...metadata,apiKey:'PRIVATE-KEY'});
  for(const body of requests)assert.deepEqual(body.settings.translationModes,['game','general']);
  assert(!JSON.stringify(requests).includes('PRIVATE-KEY'));
});

test('link explains a user-only app install and names only the missing channel permissions', async t => {
  const {store}=setup(t), hooks=[];
  const channel={id:'ko',guildId:'one',type:0,permissionsFor:()=>new PermissionsBitField(PermissionFlagsBits.ViewChannel|PermissionFlagsBits.SendMessages|PermissionFlagsBits.ReadMessageHistory),fetchWebhooks:async()=>{hooks.push('read');return new Collection();}};
  const interaction=manager(options('link',{group:'chat',channel,language:'ko'})),deps={store};
  await assert.rejects(handleCommand({...interaction,guild:null},deps),/「サーバーに追加」|「서버에 추가」/);
  await assert.rejects(handleCommand(interaction,deps),error=>/부족한 권한: 웹후크 관리\./.test(error.message)&&!error.message.includes('메시지 보내기'));
  assert.deepEqual(hooks,[]); assert.equal(store.groups('one').length,0);
  const definition=command.toJSON();
  assert.deepEqual(definition.integration_types,[0]); assert.deepEqual(definition.contexts,[0]);
  assert.deepEqual(definition.options.find(o=>o.name==='mode').options.find(o=>o.name==='mode').choices.map(c=>c.value),['game','general']);
});
