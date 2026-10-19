# ZZZ Discord Translator

[한국어](#한국어) · [English](#english) · [日本語](#日本語) · [简体中文](#简体中文)

## 한국어

**개인 연결 프로그램은 아래에서 받는 ZZZ Discord Runner입니다.** 압축을 푼 폴더의 **Start.cmd**를 실행하면 브라우저에 API 키와 연결 코드를 입력하는 설정 화면이 열립니다.

1. [Discord 서버에 봇 설치](https://discord.com/oauth2/authorize?client_id=1557261995215028254) — 서버 관리 권한이 필요합니다.
2. **[개인 연결 프로그램 다운로드 · Windows x64 ZIP](https://github.com/Odarom/zenless-discord-translator/releases/download/v0.3.2/zenless-discord-runner-0.3.2-win-x64.zip)**. 배포 페이지에서 직접 고른다면 **Assets → zenless-discord-runner-0.3.2-win-x64.zip**을 받으세요. **Source code (zip)**은 일반 PC 실행용 파일이 아닙니다.
3. ZIP을 **모두 압축 해제**하고, 꺼낸 폴더의 **Start.cmd**(확장자가 숨겨져 있으면 **Start**)를 실행합니다. ZIP 안에서 바로 실행하지 마세요. Node.js는 포함되어 있습니다.
4. 열린 설정 화면에서 **본인 API 키 입력 → API 키·설정 저장**. Discord에서 **/zzz connect**를 실행한 뒤, 받은 코드를 그 설정 화면에 입력하고 **봇과 연결 → 번역 연결 시작**을 누릅니다.
5. Discord에서 **/zzz link**로 번역할 언어 채널을 같은 그룹에 연결합니다. [채널 연결을 포함한 전체 사용법](README-ko.md#pc에서-사용하기)을 참고하세요.

**Oracle·VPS 등 본인 서버에서 실행하려면:** [개인 서버 설치·관리 화면 안내](HOSTING.md#한국어)를 따르세요. 서버에 이미 설치했다면 그 서버의 관리 화면을 여세요. PC 방식은 PC 프로그램, 서버 방식은 서버 프로그램이 실행 중이어야 번역됩니다.

**설정 화면을 다시 찾으려면:** PC는 압축을 푼 폴더의 **Start.cmd**를 다시 실행합니다. 서버는 [SSH 관리 화면](HOSTING.md#여러-서버와-비공개-관리-화면)을 엽니다. 127.0.0.1 주소만으로 설치되거나 다른 PC에서 열리는 것은 아닙니다.

[한국어 전체 사용법](README-ko.md) · [키 변경](README-ko.md#설정-화면-다시-열기--키-변경) · [통신 구조](ARCHITECTURE.md#한국어) · [이용약관](TERMS.md#한국어) · [개인정보](PRIVACY.md#한국어)

---

## English

**The personal runner is ZZZ Discord Runner, available below.** Run **Start.cmd** from the extracted folder to open the settings page in your browser, where you enter your API key and pairing code.

1. [Install the bot in your Discord server](https://discord.com/oauth2/authorize?client_id=1557261995215028254). Manage Server permission is required.
2. **[Download the personal runner · Windows x64 ZIP](https://github.com/Odarom/zenless-discord-translator/releases/download/v0.3.2/zenless-discord-runner-0.3.2-win-x64.zip)**. On the release page, choose **Assets → zenless-discord-runner-0.3.2-win-x64.zip**. **Source code (zip)** is for developers, not the ready-to-run PC package.
3. **Extract all** files, then run **Start.cmd** (**Start** if extensions are hidden) from the extracted folder. Do not run it inside the ZIP. Node.js is included.
4. In the settings page, **enter your own API key → Save API key and settings**. Run **/zzz connect** in Discord, enter the returned code in that settings page, then choose **Pair with bot → Start translation**.
5. Use **/zzz link** in Discord to connect language channels to the same group. See the [full channel setup guide](README-en.md#windows-pc).

**To run on your own Oracle/VPS server:** follow the [server installation and management guide](HOSTING.md#english). If it is already installed there, open that server’s management UI. Keep the PC program or server process running, according to where you installed it.

**To find settings again:** on PC, run **Start.cmd** again from the extracted folder. For a server, open the [private SSH management UI](HOSTING.md#several-servers-and-private-management-ui). A 127.0.0.1 address alone neither installs the program nor grants access from another PC.

[Full English guide](README-en.md) · [Hosting](HOSTING.md#english) · [Data flow](ARCHITECTURE.md#english) · [Terms](TERMS.md#english) · [Privacy](PRIVACY.md#english)

---

## 日本語

**個人用接続プログラムは、以下から入手するZZZ Discord Runnerです。** 展開したフォルダーの**Start.cmd**を実行すると、APIキーと接続コードを入力する設定画面がブラウザーで開きます。

1. [Discordサーバーにボットを導入](https://discord.com/oauth2/authorize?client_id=1557261995215028254)します。サーバー管理権限が必要です。
2. **[接続プログラムをダウンロード・Windows x64 ZIP](https://github.com/Odarom/zenless-discord-translator/releases/download/v0.3.2/zenless-discord-runner-0.3.2-win-x64.zip)**。リリースページでは**Assets → zenless-discord-runner-0.3.2-win-x64.zip**を選んでください。**Source code (zip)**は開発者向けで、実行用パッケージではありません。
3. ZIPを**すべて展開**し、展開先の**Start.cmd**（拡張子を非表示にしている場合は**Start**）を実行します。ZIP内から直接実行しないでください。Node.jsは同梱されています。
4. 設定画面で**自分のAPIキーを入力 → APIキー・設定を保存**。Discordで**/zzz connect**を実行し、表示されたコードを設定画面に入力して**ボットと接続 → 翻訳接続を開始**を押します。
5. Discordの**/zzz link**で言語別チャンネルを同じグループに接続します。[チャンネル設定を含む使い方](README-ja.md#windows-pc)を参照してください。

**自分のOracle・VPSで実行する場合：** [サーバー導入・管理画面の説明](HOSTING.md#日本語)を参照してください。導入済みなら、そのサーバーの管理画面を開きます。翻訳には、導入先のPCプログラムまたはサーバープロセスの稼働が必要です。

**設定画面を開き直すには：** PCでは展開先の**Start.cmd**を再実行し、サーバーでは[SSH管理画面](HOSTING.md#複数サーバーと非公開の管理画面)を開きます。127.0.0.1というURLだけでは導入も別PCからの接続もできません。

[日本語の詳しい使い方](README-ja.md) · [サーバー導入](HOSTING.md#日本語) · [通信の流れ](ARCHITECTURE.md#日本語) · [利用規約](TERMS.md#日本語) · [プライバシー](PRIVACY.md#日本語)

---

## 简体中文

**个人连接程序就是下方提供的ZZZ Discord Runner。** 从解压目录运行**Start.cmd**，浏览器会打开用于填写API密钥和连接码的设置页面。

1. [将机器人安装到Discord服务器](https://discord.com/oauth2/authorize?client_id=1557261995215028254)，需要管理服务器权限。
2. **[下载个人连接程序 · Windows x64 ZIP](https://github.com/Odarom/zenless-discord-translator/releases/download/v0.3.2/zenless-discord-runner-0.3.2-win-x64.zip)**。在发布页面手动选择时，下载**Assets → zenless-discord-runner-0.3.2-win-x64.zip**。**Source code (zip)**是开发者用源码，不是可直接运行的PC安装包。
3. **完整解压**ZIP，再运行解压目录中的**Start.cmd**（隐藏扩展名时显示为**Start**）。请勿直接在ZIP内运行，已包含Node.js。
4. 在设置页面**输入自己的API密钥 → 保存API密钥及设置**。在Discord运行**/zzz connect**，将收到的连接码输入设置页面，再点击**连接机器人 → 启动翻译连接**。
5. 在Discord使用**/zzz link**把不同语言频道加入同一组，详见[完整频道设置指南](README-zh-CN.md#windows电脑)。

**在自己的Oracle或VPS运行：** 请参照[服务器安装及管理页面说明](HOSTING.md#简体中文)。若已经安装，应打开该服务器的管理界面。翻译时需保持安装位置的PC程序或服务器进程运行。

**重新找到设置页面：** PC用户再次运行解压目录中的**Start.cmd**；服务器用户打开[SSH私有管理界面](HOSTING.md#多个服务器与私有管理界面)。仅有127.0.0.1地址并不代表已安装，也无法直接从另一台PC访问。

[完整简体中文指南](README-zh-CN.md) · [服务器安装](HOSTING.md#简体中文) · [通信流程](ARCHITECTURE.md#简体中文) · [使用条款](TERMS.md#简体中文) · [隐私政策](PRIVACY.md#简体中文)

---

## 2026-10-19 · 13 languages

### 한국어

번역 언어는 한국어·영어·일본어·중국어 간체/번체·독일어·프랑스어·스페인어·포르투갈어·러시아어·태국어·베트남어·인도네시아어 13개입니다. 화면 표시와 설명서는 기존 4개 언어를 유지합니다. 기존 항목 1,868개에 추가 9개 언어의 이름 16,802개를 연결했습니다. 테스트 표시가 있는 10개 값은 제외했으며, 없는 이름은 만들어 채우지 않습니다. 신규·미출시 용어는 라이브 적용 확인 후 검토합니다. 프로그램을 이번 버전으로 업데이트한 뒤에는 같은 13개 언어의 이름 추가·수정을 DB 업데이트로 받을 수 있습니다. 새 언어 코드 자체를 추가할 때는 프로그램 업데이트도 필요합니다.

### English

Translation supports 13 languages: Korean, English, Japanese, Simplified/Traditional Chinese, German, French, Spanish, Portuguese, Russian, Thai, Vietnamese and Indonesian. Interface text and guides remain in four languages. Another 16,802 localized names extend 1,868 existing concepts across nine additional languages. Ten placeholder values are excluded; missing names are not invented. New/unreleased terms require confirmed live availability before review. After installing this program update, additions and corrections within these 13 languages can arrive through DB updates. Adding a new language code still requires a program update.

### 日本語

翻訳は韓国語・英語・日本語・簡体字/繁体字中国語・ドイツ語・フランス語・スペイン語・ポルトガル語・ロシア語・タイ語・ベトナム語・インドネシア語の13言語に対応します。画面表示と説明書は従来の4言語です。既存1,868概念に追加9言語の名称16,802件を対応付け、テスト用の値10件を除外しました。不明な名称は補作しません。新規・未公開用語は正式実装を確認してから検討します。このプログラム更新後、同じ13言語内の名称追加・修正はDB更新で受け取れます。新しい言語コード自体の追加にはプログラム更新も必要です。

### 简体中文

翻译支持韩语、英语、日语、简体/繁体中文、德语、法语、西班牙语、葡萄牙语、俄语、泰语、越南语和印尼语，共13种语言。界面及说明保留原有4种语言。为1,868个既有概念关联额外9种语言的16,802个名称，排除10个测试占位值，不编造缺失名称。新增及未发布术语须确认正式实装后再审核。安装本次程序更新后，同一13种语言内的名称补充和修正可通过DB更新接收；增加新语言代码仍需程序更新。
