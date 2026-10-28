import { ApplicationIntegrationType, ChannelType, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { LANGUAGES } from './config.js';

const groupOption = option => option.setName('group').setDescription('같이 대화할 그룹 이름 (예: friends)').setRequired(true).setMaxLength(24);
export const command = new SlashCommandBuilder()
  .setName('zzz').setDescription('젠레스 채팅 번역 설정')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
  .setContexts(InteractionContextType.Guild)
  .addSubcommand(c => c.setName('connect').setDescription('개인 PC·서버의 번역 프로그램 연결 코드 발급'))
  .addSubcommand(c => c.setName('disconnect').setDescription('개인 번역 프로그램 연결 해제'))
  .addSubcommand(c => c.setName('api-set').setDescription('이 서버의 번역 API 키·모델·사용 한도 등록 또는 변경')
    .addStringOption(o => o.setName('provider').setDescription('사용할 번역 서비스').setRequired(true)
      .addChoices({ name: 'Gemini (무료 여부는 API 계정에 따름)', value: 'gemini' }, { name: 'OpenAI (유료 API)', value: 'openai' })))
  .addSubcommand(c => c.setName('api-status').setDescription('이 서버의 API 설정 확인 (키는 표시하지 않음)'))
  .addSubcommand(c => c.setName('api-delete').setDescription('이 서버의 API 키 삭제와 번역 중지'))
  .addSubcommand(c => c.setName('link').setDescription('대화 그룹에 언어별 채널 연결')
    .addStringOption(groupOption)
    .addChannelOption(o => o.setName('channel').setDescription('번역에 사용할 텍스트 채널').addChannelTypes(ChannelType.GuildText).setRequired(true))
    .addStringOption(o => o.setName('language').setDescription('이 채널에서 읽고 쓸 언어').setRequired(true).addChoices(...Object.entries(LANGUAGES).map(([value, name]) => ({ name, value })))))
  .addSubcommand(c => c.setName('unlink').setDescription('채널 연결 해제 (채널과 기존 메시지는 유지)')
    .addChannelOption(o => o.setName('channel').setDescription('연결을 해제할 채널').addChannelTypes(ChannelType.GuildText).setRequired(true)))
  .addSubcommand(c => c.setName('mode').setDescription('그룹의 게임 번역(기본)·일반 번역(DB 미사용) 전환')
    .setDescriptionLocalizations({ 'en-US': 'Switch a group between game translation (default) and general translation (no game DB)', ja: 'グループのゲーム翻訳（初期設定）・一般翻訳（DBなし）を切り替え', 'zh-CN': '切换组的游戏翻译（默认）或普通翻译（不使用游戏数据库）' })
    .addStringOption(groupOption)
    .addStringOption(o => o.setName('mode').setDescription('번역 방식').setRequired(true).addChoices(
      { name: '게임 번역 · 젠레스 DB 사용 (기본)', value: 'game', name_localizations: { 'en-US': 'Game translation · ZZZ DB (default)', ja: 'ゲーム翻訳・ZZZ DB使用（初期設定）', 'zh-CN': '游戏翻译・使用ZZZ数据库（默认）' } },
      { name: '일반 번역 · 게임 DB 미사용', value: 'general', name_localizations: { 'en-US': 'General translation · no game DB', ja: '一般翻訳・ゲームDBなし', 'zh-CN': '普通翻译・不使用游戏数据库' } })))
  .addSubcommand(c => c.setName('pause').setDescription('대화 그룹의 번역 일시 중지').addStringOption(groupOption))
  .addSubcommand(c => c.setName('resume').setDescription('대화 그룹의 번역 다시 시작').addStringOption(groupOption))
  .addSubcommand(c => c.setName('status').setDescription('연결된 채널과 번역 상태 확인'))
  .addSubcommand(c => c.setName('usage').setDescription('서울 시간 기준 오늘의 AI 요청·토큰 사용량 확인'));
