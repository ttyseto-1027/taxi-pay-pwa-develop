# 実装履歴 Version 1.4β
> 個別実装メモをこのファイルへ集約する。旧ファイルの履歴はGitでも参照可能。

---

## IMPLEMENTATION_APP_JS01_DIAGNOSTIC_ENHANCE.md

# APP-JS-01 診断ログ強化
Build: `20260820-07`
作成日時: `2026/08/20 15:05:58 JST`

Drive処理自体は変更せず、例外内容だけを詳細記録する診断版。

記録対象:
- error name
- message
- code
- filename
- line
- column
- stack

Promise未処理例外は `APP-PROMISE-01` として別記録。
「診断情報をコピー」の recentLogs に detail を追加。

---

## IMPLEMENTATION_BUILD16.md

# Build 20260824-16
作成日時: 2026/08/24 23:27:39 JST

## 数字パネルの修正入力
- 出勤・退勤の「時」「分」を再タップした場合、前回値を数字パネルへ引き継がない
- 通常休憩・深夜休憩も同様に、数字パネルは常に空欄から開始
- 既存の入力枠表示は、新しい数字を入力するまでは保持
- クリア／←で数字がなくなった場合もパネル表示は空欄

---

## IMPLEMENTATION_BUILD18.md

# Build 20260824-18
作成日時: 2026/08/25 00:02:53 JST

## 修正
- 勤務実績の出勤・退勤・休憩入力が反応しない不具合を修正
  - 原因: 削除済み変数 `pendingBreakNormalize` の参照による JavaScript 停止
- 月次集計の第1軸・第2軸が空欄になる不具合を修正
  - 同じ JavaScript 停止が原因
- 「期間指定」はボタン押下時だけ開始日・終了日を表示
- 第2軸の選択欄をPC表示ではコンパクト化

---

## IMPLEMENTATION_BUILD19_AXIS_LAYOUT.md

# Build 20260825-01
作成日時: 2026/08/25 00:15:21 JST

- 第2軸を第1軸の真下に配置
- 第1軸・第2軸の選択欄を同じ幅に統一
- 第2軸追加/非表示ボタンは各軸の右側に配置
- スマホでは縦並び

---

## IMPLEMENTATION_BUILD_20260825_02.md

# Build 20260825-02
作成日時: 2026/08/25 00:18:39 JST

## 更新通知の強制表示
- Buildが前回利用者確認済みBuildより新しければ、リモート確認前でも即時に更新通知を表示
- app-meta.jsonの取得失敗や、app-meta.jsだけ先に最新版を読み込んだ場合でも通知を維持
- 利用者が「キャッシュを更新して最新版を取得」を完了するまで確認済みBuildは更新しない
- したがって、修正内容の大小に関係なくBuild番号が変わるたびに更新通知を表示

---

## IMPLEMENTATION_BUILD_20260825_03.md

# Build 20260825-03
作成日時: 2026/08/25 00:40:19 JST

- 出勤・退勤: [hh]時 [mm]分
- 出勤・退勤パネルでは休憩用［時間］［分］を非表示
- 休憩入力は変更なし

## 固定回帰チェック
- Build更新: OK
- JST: OK
- 新バージョン通知: OK
- 勤務実績入力: OK
- 保存・編集: OK
- 月次集計: OK
- バックアップ・復元: OK

---

## IMPLEMENTATION_BUILD_20260825_05_COMBINED.md

# Build 20260825-05 統合修正版

Build 20260825-04 と Build 20260825-05 の差分を統合。

- 出退勤時刻入力から休憩専用［時間］［分］ボタンを除外
- 出退勤時刻表記を［hh］時［mm］分に統一
- 「当月」の横軸を日付単位へ変更
- 当月は登録済み勤務日ごとの累積推移を表示
- 折れ線は1点でもポイント表示
- 棒グラフ／積み上げ棒グラフの表示ロジックを修正
- 異なる単位の第2軸は積み上げず横並び表示
- 第2軸は追加ボタンを押すまで非表示
- 最終Build情報は 20260825-05

---

## IMPLEMENTATION_BUILD_20260825_06.md

# Build 20260825-06
作成日時: 2026/08/25 01:25:31 JST

- 積み上げ棒を1営業ごとに色分け
- 休憩入力に時間/分の入力案内

## 固定回帰チェック
- Build更新: OK
- JST: OK
- 新バージョン通知: OK
- 勤務実績入力: OK
- 保存・編集: OK
- 月次集計: OK
- バックアップ・復元: OK

---

## IMPLEMENTATION_BUILD_20260825_07.md

# Build 20260825-07
作成日時: 2026/08/25 01:56:36 JST

- PC版の数字パネルを右側へ移動
- 推移グラフの初期表示を「当月」に変更
- 当月・期間指定では積み上げ棒を選択不可
- 金額系Y軸をk表記から万円表記へ変更
- 金額系Y軸は2万円単位の目盛り

## 固定回帰チェック
- Build更新: OK
- JST: OK
- 新バージョン通知: OK
- 勤務実績入力: OK
- 保存・編集: OK
- 月次集計: OK
- バックアップ・復元: OK

---

## IMPLEMENTATION_BUILD_20260825_08.md

# Build 20260825-08
作成日時: 2026/08/25 02:05:23 JST

- 「当月」の折れ線・棒グラフを累積値から各営業日単独の実績へ修正
- 例: 08/19=91,500円、08/22=83,000円として表示
- 当月・期間指定は日別単独実績、3/6/12か月・全期間は月単位集計

## 固定回帰チェック
- Build更新: OK
- JST: OK
- 新バージョン通知: OK
- 勤務実績入力: OK
- 保存・編集: OK
- 月次集計: OK
- バックアップ・復元: OK

---

## IMPLEMENTATION_BUILD_20260825_09.md

# Build 20260825-09
作成日時: 2026/08/25 02:23:59 JST

- 3/6/12か月・全期間の積み上げ棒を月内の各営業日ごとに色分けして積み上げ
- 当月・期間指定は従来どおり積み上げ棒を選択不可

## 固定回帰チェック
- Build更新: OK
- JST: OK
- 新バージョン通知: OK
- 勤務実績入力: OK
- 保存・編集: OK
- 月次集計: OK
- バックアップ・復元: OK

---

## IMPLEMENTATION_BUILD_20260825_10.md

# Build 20260825-10
作成日時: 2026/08/25 02:30:21 JST

- 締め済み過去月の積み上げ棒で state.history[].dailyEntries を参照
- 積み上げ棒を加算可能な指標（税込営収・概算総支給・概算手取り）に限定
- 第2軸表示中は積み上げ棒を選択不可
- 時間あたり手取り・還元率など非加算指標は積み上げ棒を選択不可
- 当月・期間指定では従来どおり積み上げ棒を選択不可

## 固定回帰チェック
- Build更新: OK
- JST: OK
- 新バージョン通知: OK
- 勤務実績入力: OK
- 保存・編集: OK
- 月次集計: OK
- バックアップ・復元: OK

---

## IMPLEMENTATION_BUILD_20260825_11.md

# Build 20260825-11
作成日時: 2026/08/25 02:43:59 JST

- 時間あたり手取りのY軸を1,000円刻みに変更
- 実質還元率・手取り還元率のY軸を20%刻みに変更
- 実値は丸めず、グラフ目盛りのみ整形

## 固定回帰チェック
- Build更新: OK
- JST: OK
- 新バージョン通知: OK
- 勤務実績入力: OK
- 保存・編集: OK
- 月次集計: OK
- バックアップ・復元: OK

---

## IMPLEMENTATION_BUILD_20260825_12.md

# Build 20260825-12
作成日時: 2026/08/25 12:08:08 JST

- スマホ版数字パネルをPC版と同じ3列配置へ統一
- 1/2/3、4/5/6、7/8/9、クリア/0/←
- 休憩入力の時間/分は下段2列

## 固定回帰チェック
- Build更新: OK
- JST: OK
- 新バージョン通知: OK
- 勤務実績入力: OK
- 保存・編集: OK
- 月次集計: OK
- バックアップ・復元: OK

---

## IMPLEMENTATION_BUILD_20260826_14_DATA_SAFETY.md

# Build 20260826-14 — 保存データ保護

## 目的
スマホ側で勤務実績が見えなくなった事象を受け、保存データを破壊しないことを最優先にした保護層を追加。

## 変更
- V1〜V10を探索。V10が空で旧キーに勤務実績/締め履歴がある場合は旧データを優先。
- 現行キー破損時は旧キーへフォールバック。既存キーがすべて破損している場合は書込み禁止。
- 旧データは削除せず、現行形式への初回保存前に退避。
- 保存前スナップショットを最大5世代、端末localStorage内に保持。
- DEVELOPとPRODUCTIONの保存キーを分離。DEVELOPは本番データを読取り候補にはできるが、本番キーへ書き込まない。
- Google Drive復元前にも端末データを退避し、バックアップ構造を検証。
- 読込異常または旧キー読込時は画面上に警告を表示。

## 変更していないもの
給与計算式、勤務実績入力項目、月次集計、グラフ、認証仕様、Firestore利用者情報、管理画面の業務ロジックは変更していない。

---

## IMPLEMENTATION_DRIVE_AUTH_FIX.md

# Drive権限取得エラー修正
Build: 20260820-04
作成日時: 2026/08/20 13:24:46 JST

- `ensureDriveAccess is not defined` を修正。
- Drive権限取得関数をDrive同期モジュールの正しいスコープへ配置。
- 同期ボタンを押した場合だけFirebase Google認証へ `drive.file` の追加権限を要求。
- Google Cloud側のDrive API有効化は別途一度だけ必要。

---

## IMPLEMENTATION_DRIVE_BIND_FIX.md

# Driveバックアップ bind エラー修正
Build: `20260820-08`
作成日時: `2026/08/20 15:11:52 JST`

診断ログにより `phase56-drive-backup.js` の bind() 内で
`ReferenceError: disconnect is not defined` を特定。

存在しない `disconnect` 関数へのイベント登録を削除。
Drive認証・バックアップ本体・詳細診断機能は変更していない。

---

## IMPLEMENTATION_DRIVE_DIRECT_AUTH_FIX.md

# Google Drive権限画面が開かない問題の修正

Build: `20260820-05`
作成日時: `2026/08/20 14:45:40 JST`

## 修正
DriveバックアップボタンからFirebase認証側の
`TaxiPayRequestDriveAuthorization()` を直接呼び出す。

CustomEventを経由せず、
利用者のクリック操作から `signInWithPopup()` までを直接つなぐ。

Google Drive APIは有効化済み、
OAuthスコープは `drive.file` を使用する。

---

## IMPLEMENTATION_DRIVE_MODULE_FULL_AUDIT.md

# Google Drive モジュール総点検・再構成

Build: `20260820-10`  
作成日時: `2026/08/20 15:23:58 JST`

## 今回の原因

Build 20260820-08 の `phase56-drive-backup.js` では、呼び出しているにもかかわらず
定義が欠落しているDrive内部関数が複数存在していました。

確認対象:
- `api`
- `ensureFolder`
- `findFile`
- `uploadJson`
- `listBackups`
- `deleteFile`
- `cleanupOld`

過去には `disconnect` も同様に欠落していました。

## 対応

Driveモジュールを一つの整合した実装として再構成しました。

実装済み:
- Firebase Google認証で取得した `drive.file` アクセストークン利用
- アプリ専用フォルダの検索・作成
- JSON新規保存
- `current.json` 更新
- 同期1回＝1世代バックアップ
- バックアップ一覧取得（ページング対応）
- 容量表示
- 90日超バックアップ自動削除
- 90日以内バックアップ個別削除
- Driveから端末への復元
- 復元前端末データのローカル退避
- 端末とDriveの競合表示
- 認証期限切れ時のセッショントークン破棄

## 維持した原則

- 端末保存とGoogle Driveバックアップは別。
- Google Driveへの書き込みは利用者が
  「Google Driveにバックアップ」を押した場合だけ。
- 画面遷移・一定時間・入力保存を契機とした自動バックアップは行わない。
- 復元しただけではGoogle Driveへ自動上書きしない。
- 管理者へ勤務実績・給与設定を送信しない。

## UI整理

旧Drive接続方式の残骸だった「Drive認証を解除」ボタンを削除。
一般利用者の通常操作は「Google Driveにバックアップ」に集約。

## 検証

Drive内部の必須関数定義を静的照合。
JavaScript構文チェックを実施。

---

## IMPLEMENTATION_DRIVE_REAUTH_FIX.md

# Google Drive権限取得を再認証方式へ変更

Build: `20260820-06`
作成日時: `2026/08/20 14:53:47 JST`

## 原因
Build 20260820-05 では、
- 旧CustomEvent方式
- 新しい直接呼び出し方式
のDrive認証処理が併存していた。

また、Googleログイン済みの状態で `signInWithPopup()` を使っていたため、
通常のログイン状態変更処理を再度動かす可能性があった。

## 修正
- 旧CustomEvent方式を削除
- Drive認証経路を1本化
- 現在ログイン中のFirebase userに対して
  `reauthenticateWithPopup()` で `drive.file` を追加要求
- 異なるGoogleアカウントを選択した場合は停止

Google Drive API：有効化済み
OAuth scope：drive.file

---

## IMPLEMENTATION_FIREBASE_DRIVE_SCOPE.md

# Firebase Googleログイン統合 Drive権限取得
Build: 20260820-03
作成日時: 2026/08/20 13:07:54 JST

- 通常のGoogleログインでは従来の認証スコープのみ。
- 利用者が「Google Driveへ同期」を押した時だけ drive.file scope を追加要求。
- Google認証結果からGoogle API access tokenを取得し、Drive REST APIに利用。
- Drive専用の利用者設定画面・接続ボタンは使用しない。
- Driveへの書き込みは「Google Driveへ同期」を押した場合だけ。
- 管理者側ではGoogle CloudプロジェクトのDrive API有効化が必要。

---

## IMPLEMENTATION_PHASE0_01.md

# Phase 0① 正常ログイン動作の基準版

## 目的
Phase 3①の変更をいったん取り除き、正常ログインが確認されていた元のコードを基準版として復元します。

## 実施内容
- `taxi-pay-pwa-main (8).zip` を基準に復元
- Phase 3①で追加したメニュー関連変更を含めない
- Googleログイン、利用者確認、アプリ表示の既存処理を維持
- 更新ファイルが古いService Workerキャッシュに残らないよう、ビルド識別子とキャッシュ名だけ更新

## Phase 0完了確認
1. GitHubへZIP内の全ファイルを上書きする
2. 公開ページを通常表示する
3. Googleログインする
4. F5を押さずに「勤務実績を入力」が表示されることを確認する
5. ログアウト後、再ログインでも同様に表示されることを確認する
6. 一度F5を押した後も正常に表示されることを確認する

このZIPではPhase 3①のメニュー機能は実装していません。Phase 0の動作確認後、この版を新しい開発ベースにします。

---

## IMPLEMENTATION_PHASE0_02.md

# Phase 0② ログイン画面遷移修正版

作成日時：2026年7月28日 12:26（日本時間）

## 特定した原因

起動時の `firebase-auth.js` では、Firebaseの認証状態復元が完了する前に `onAuthStateChanged()` の監視を開始していました。

そのためGoogleログインから戻った直後に、次の処理が競合する構成でした。

1. 認証状態監視が一時的な未ログイン状態を受け取り、`showGate()` でログイン画面を表示する
2. `setPersistence()` と `getRedirectResult()` が後から完了する
3. 認証済み利用者の確認処理が進んでも、初回表示がログイン画面側へ戻される場合がある
4. F5後は保存済み認証状態が既に確定しているため、勤務実績画面が表示される

## 修正内容

`firebase-auth.js` の起動順序を次のように変更しました。

1. `setPersistence()` を完了
2. `getRedirectResult()` を確認
3. `auth.authStateReady()` で保存済み認証状態の復元完了を待機
4. `redirectResult.user` または `auth.currentUser` を一度だけ `routeOnce()` で処理
5. 初期処理の完了後に `onAuthStateChanged()` の監視を開始

これにより、認証状態が確定する前の一時的な未ログイン判定で、ログイン画面へ戻される競合を防ぎます。

## 変更対象

- `firebase-auth.js`
- `index.html`（キャッシュ回避用の読込識別子のみ）
- `boot.js`（キャッシュ回避用の読込識別子のみ）
- `sw.js`（キャッシュ名のみ）

給与計算、勤務実績保存、利用者プロフィール、Firestoreルールは変更していません。

## 確認項目

1. ログアウト状態からGoogleログインする
2. F5を押さずに勤務実績入力画面が表示される
3. ログアウト後、再度ログインして同様に表示される
4. ページを閉じて再度開いた場合も、保存済みログイン状態から勤務実績画面が表示される

---

## IMPLEMENTATION_PHASE0_03.md

# Phase 0③ ログアウト後の再ログイン修正

作成日時: 2026-07-28 12:35 JST

## 特定した原因

`routeOnce()` が、前回ログイン完了時の `completedUid` をログアウト後も保持していました。
ログアウト処理では `window.TaxiPayCurrentProfile` を `null` にしていたため、同じGoogleアカウントで再ログインすると `routeOnce()` は処理済みUIDと判断して `null` を返し、利用者確認と `showApp()` を実行しませんでした。

診断ログでは `AUTH-POPUP-OK` と `AUTH-DIRECT-ROUTE` で止まり、`AUTH-STATE-SIGNED-IN` 以降が出ないことが、この分岐と一致します。

## 修正内容

- ログアウト時に `completedUid`、`routingUid`、`routingPromise` をリセット
- `onAuthStateChanged` の未ログイン分岐でも同じ状態をリセット
- `completedUid` が一致してもキャッシュ済みプロフィールが存在しない場合は、利用者確認を再実行
- Service WorkerとJavaScriptのキャッシュ識別子を `phase0-03` に更新

## 変更していない範囲

給与計算、勤務実績、Firestoreのデータ形式、画面構成は変更していません。

---

## IMPLEMENTATION_PHASE0_05_DIAGNOSTIC.md

# Phase 0⑤ 診断専用版

## 目的

iPhone／iPad環境で、Google認証後にログイン画面へ戻る原因を特定するための診断版です。

## ベース

Phase 0③（PC再ログイン修正版）をベースにしています。Phase 0④のポップアップ方式への変更は含めていません。

## 変更内容

認証方式や給与計算機能は変更せず、次の診断情報のみ追加しました。

- 現在URL、search、hash、referrer
- localStorage／sessionStorageのキー一覧（値や認証トークンは出力しない）
- 保存されたログイン試行の方式・段階
- `auth.currentUser` の有無とマスク済みメール
- `getRedirectResult()` の結果有無、所要時間、providerId、operationType
- `onAuthStateChanged()` の発火回数と認証状態
- Service Workerのcontroller・registration情報
- 表示状態、Cookie利用可否、オンライン状態、PWA起動状態

## 検証対象

LINEのリンクからiPhone版Chromeを起動した場合、およびSafariから直接起動した場合の両方で診断情報を取得してください。

---

## IMPLEMENTATION_PHASE0_06.md

# Phase 0⑥：iPhone・iPad Popupログイン修正

## 目的
Phase 0⑤の診断で、iPhone版Chrome（WebKit）では `signInWithRedirect()` 復帰後に `getRedirectResult()` が常に空となり、認証状態も未ログインのままになることを確認した。

## 変更内容
- Phase 0⑤をベースに、iPhone・iPadのGoogleログイン方式を `signInWithPopup()` に変更。
- iOSでPopupが失敗してもRedirectへ自動フォールバックしない。
- Popupの開始・成功・失敗を既存の診断ログへ記録。
- Phase 0③の再ログイン修正とPhase 0⑤の診断機能を維持。
- Service Workerと読み込みURLのキャッシュ識別子を更新。

## 変更しない範囲
- 給与計算処理
- Firestoreの利用者確認・権限判定
- 管理画面
- Firebase設定値

## テスト手順
1. GitHub Pagesへ全ファイルを上書きする。
2. iPhoneでLINEから外部ブラウザ（Chrome）を開く。
3. Googleログインボタンを押す。
4. アカウント選択画面が別ウィンドウまたはブラウザ内認証画面として開くことを確認する。
5. 成功時は勤務実績入力画面へ遷移することを確認する。
6. 失敗時は診断情報をコピーする。

---

## IMPLEMENTATION_PHASE0_07.md

# Phase 0⑦ Firestore利用者確認修正版

- Google/Firebase認証方式はPhase 0⑥のまま維持。
- Firestoreのadmins、betaAllowlist、users読み込みに10秒のタイムアウトを追加。
- users読み込みがタイムアウトした場合、管理者に限り事前登録情報から起動。
- 一般利用者は従来どおりusers情報を確認し、失敗時はエラー表示。
- 診断版表示: phase0-07-firestore-user-fix

---

## IMPLEMENTATION_PHASE1.md

# Phase 1 実装記録（再構成版）

## 目的

PC・スマートフォン双方のGoogleログイン安定版を維持したまま、画面構成と権限別UIを整理する。

## 画面構成

- 勤務実績
  - 勤務実績入力
  - 日別明細
  - 給与シミュレーター
- 月次集計（組合員専用・完全に別ビュー）
- 有給管理（組合員専用）
- 控除額設定（組合員専用）
- 利用者情報
- 設定
- ヘルプ
- ログアウト

## 非組合員

- 目標手取りを表示しない
- 月次集計、有給管理、控除額設定をグレーアウト
- 標準控除による給与概算のみ利用可能

## 開発管理者プレビュー

- 実際の権限
- 組合員UI
- 非組合員UI

Firestore上の利用者区分は変更せず、表示上の権限だけを切り替える。

## 認証保護

- firebase-auth.js は変更しない
- PC用popup/redirect処理を変更しない
- スマートフォン用redirect復帰処理を変更しない
- Service Workerのキャッシュ名だけを更新し、旧画面の残存を防止

## Phase 1範囲

画面基盤と権限制御まで。月次集計、有給、控除額の本計算・保存処理は後続Phaseで実装する。


## スマホメニューのログアウト修正

- メニュー内のログアウト操作では、Firebaseのサインアウトを開始する前にドロワーメニューと背景オーバーレイを閉じる。
- 認証処理（firebase-auth.js）は変更しない。
- Service Workerのキャッシュ名とmenu.jsのクエリ文字列を更新し、旧メニュー処理の残存を防止する。


## 2026-07-28 ログアウト後メニュー残留修正 v3

- PCとスマートフォンの双方で、ログアウトボタン押下時に共通メニューへ `hidden` を設定する。
- 認証ゲートが表示された場合もMutationObserverでメニューを再度強制閉鎖する。
- `#authGate:not([hidden])` を基準にしたCSSでもメニューと背景を非表示にし、認証処理の状態更新順に依存しない三重対策とした。
- Firebase認証処理本体は変更していない。

## 2026-07-28 PCログインボタンのクリック遮断修正

- ログアウト後のPC画面で、透明なメニュー／背景要素がGoogleログインボタンのクリックを遮る可能性を除去。
- 認証画面を `position: fixed`・最前面レイヤーとして表示。
- `auth-pending` 中は共通メニュー、背景、メニューボタンをCSSで完全に非表示・操作不能化。
- `firebase-auth.js` は変更していない。

---

## IMPLEMENTATION_PHASE1_01.md

# Phase 1-01 共通メニュー基盤

## 基準
Phase 0-07（PC・iPhoneログイン動作確認済み）をそのまま基準コードとして使用。

## 変更ファイル
- index.html
- styles.css
- sw.js
- menu.js（新規）

## 実装内容
- 右上の共通メニュー
- ホーム、勤務実績、月次集計・給与シミュレーターへの移動
- 有給管理、控除額設定、設定への入口
- 利用者情報、お知らせ、ヘルプの表示
- メニュー内ログアウト

## 維持したファイル
- firebase-auth.js
- firebase-config.js
- boot.js
- app.js
- v13-features.js
- diagnostics.js

認証・Firestore利用者確認・給与計算ロジックには変更を加えていない。

---

## IMPLEMENTATION_PHASE1_REBUILD.md

# Phase 1 再構築版

- 基準: Phase 0⑦
- 認証関連ファイルは変更しない
- 勤務実績画面: 入力・日別明細・給与シミュレーター
- 月次集計: 独立した組合員専用画面
- 非組合員: 目標手取り、月次集計、有給管理、控除額設定を利用不可
- 管理者: 実データを書き換えない組合員UI／非組合員UIプレビュー
- メニューは main 内に配置し、Phase 0⑦ の auth-pending 制御でログイン中は必ず非表示

## 2026-07-28 PC応答停止修正

- `index.html` 冒頭の診断用JavaScriptで壊れていた改行文字列を `\n` に修正。
- `phase1-ui.js` の `MutationObserver` が、認証画面表示中に `body.class` を無条件で再変更する構造を修正。
- メニューが実際に開いている場合のみ閉鎖処理を実行し、`closeMenu()`自体も変更が必要な場合だけDOM属性を更新する冪等処理に変更。
- 認証処理（`firebase-auth.js`）は変更していない。

## 2026-07-28 PC認証停止修正
- Phase 1 UIの初期化を `taxipay:profile` / `taxipay:app-ready` 受信後へ延期。
- 認証準備中はPhase 1によるDOM変更、権限制御、URLハッシュ変更を行わない。
- `MutationObserver` を完全撤去。
- ログアウト押下時のメニュー閉鎖だけは認証状態に依存せず先に登録。

---

## IMPLEMENTATION_PHASE2_USER_SETTINGS.md

# Phase 2 利用者設定（正式仕様）

## 対象項目
- 乗務員番号
- 営業所
- 勤務形態
- 組合員区分
- 扶養人数
- 利用状態
- 保存・編集

## 編集権限
### 一般利用者
- 乗務員番号：編集可能
- 営業所：編集可能
- 勤務形態：編集可能
- 扶養人数：編集可能
- 組合員区分：表示のみ
- 利用状態：表示のみ

### 管理者
- 全項目を編集可能

## 個人識別
利用者データの主キーは Firebase Authentication の UID とする。
メールアドレスはGoogle認証および事前登録照合に利用する。
乗務員番号は認証キー・主キーとして使用しないため、本Phaseでは利用者本人による編集を許可する。

## 認証保護
Phase 0⑦の認証関連ファイルは変更しない。
Phase 2の初期化は taxipay:profile または taxipay:app-ready の受信後のみ実行する。

---

## IMPLEMENTATION_PHASE3_01.md

# v1.3β Phase 3①（先行）実装内容

- ヘッダーの⚙️を「☰ メニュー」に変更
- β版専用メニューを追加
- 勤務実績入力／営業実績／有給管理の画面切替を追加
- 控除額設定は既存設定ダイアログを利用
- 管理者だけユーザー管理を表示
- β版ステータスを小さく表示
- 設定画面タイトルを「控除額設定」に変更
- 給与計算・保存形式・Firebase処理は変更なし

## 確認項目
1. ログイン後、ヘッダーに「☰ メニュー」が表示される
2. 勤務実績入力を選ぶと既存画面が表示される
3. 営業実績を選ぶとβ開発中画面が表示される
4. 有給管理を選ぶと近日公開画面が表示される
5. 控除額設定を選ぶと既存設定ダイアログが開く
6. 管理者だけユーザー管理が表示される
7. 再読み込み後も直前の画面が維持される（同一タブ内）

推奨コミットメッセージ：
`β版メニューを追加して画面構成を整理`

---

## IMPLEMENTATION_PHASE3_01_LOGIN_SAFE.md

# v1.3β Phase 3①（正常ログイン動作維持版）

## 実装内容
- ヘッダーの歯車表示を「☰ メニュー」へ変更
- β版限定ステータス付きメニューを追加
- 勤務実績入力／営業実績／有給管理の画面切替を追加
- 控除額設定は既存の設定ダイアログをそのまま利用
- 管理者だけユーザー管理を表示
- Firebase認証のV17ログイン修正は変更せず維持
- Service Workerのキャッシュ名を更新

## ログイン回帰防止
- firebase-auth.js の onAuthStateChanged → routeOnce → showApp の流れは変更していません。
- menu.js は taxipay:app-ready を受けた後に勤務実績画面を選択します。
- 認証前は body.auth-pending により従来どおりアプリ本体を非表示にします。

## 確認項目
1. 未ログイン時にログイン画面だけが表示される
2. Googleログイン完了後、F5を押さず勤務実績入力が表示される
3. ☰ メニューが表示される
4. 各メニュー項目が正しく切り替わる
5. 控除額設定が開く
6. 管理者のみユーザー管理が表示される

---

## IMPLEMENTATION_PHASE3_PERSONAL_SETTINGS.md

# Phase 3 個人設定 実装記録

## 実装範囲
- 扶養親族等の数
- 住民税
- 組合費
- 共済費
- その他控除
- 有給の標準報酬日額、開始残数、次回付与日、次回付与日数
- 現在の有給残数と付与・使用履歴
- 個人設定JSONの保存・復元

## 保存先
給与計算の既存データ構造 `taxiPayPwaStateV10.settings` を使用し、利用者端末の localStorage に保存する。
Firebase/Firestoreには個人の控除額・扶養人数・有給設定を保存しない。

## Phase 2の確定仕様
利用者情報は一般利用者には表示のみ。変更は管理者が行う。扶養人数はPhase 3へ移動した。

## 認証保護
firebase-auth.js、firebase-config.js、boot.js、diagnostics.js、firestore.rulesは変更していない。
Phase 3スクリプトは認証完了イベント後に初期化する。

---

## IMPLEMENTATION_PHASE4_ADJUSTMENT_LOCATION_FIX.md

# Phase4 修正：給与追加調整の配置

## 修正内容
- 「給与の追加調整」を控除額設定画面から勤務実績画面へ移動。
- メーター検査、当直、故障対応等は対象日・開始日時・終了日時・適用時給で登録。
- 22:00～翌5:00は深夜割増1.25倍で自動計算。
- 登録済み一覧は、勤務実績画面で選択中の給与月に該当するデータだけを表示。
- 控除額設定画面は法定控除・任意控除・その他控除のみを扱う。

## データ保護
- `settings.additionalPayments` の保存構造、既存ID、既存データは変更しない。
- 表示場所のみを変更するため、初回Phase4版で登録済みの追加支給も保持される。
- localStorageキー、既存勤務実績、控除履歴は変更・削除しない。

---

## IMPLEMENTATION_PHASE4_DEDUCTIONS_PAYROLL.md

# v1.4β Phase4 実装記録

- 控除額を法定控除・任意控除・その他控除に分割。
- 適用年月ごとの履歴を追加。履歴未登録時は既存の旧設定値を読み取り専用の互換値として使用。
- メーター検査・当直・故障対応等の時給勤務、およびその他支給を追加。
- 22:00～翌5:00を深夜時間として1.25倍で概算。
- 東京都最低賃金は履歴データとして保持（2025-10-03から1,226円）。
- 既存localStorageキーと既存フィールドは削除・初期化せず保持。
- 端数処理は暫定的に支給明細ごとにMath.round。正式方式判明後に差し替え可能。

---

## IMPLEMENTATION_PHASE4_PHASE7_COMPLETE.md

# Phase 4 / Phase 7 残件対応
Build: `20260824-11`
作成日時: `2026/08/24 21:25:52 JST`

## Phase 4
給与シミュレーターとして以下の端数処理を実装。
- 1出番ごとの賃金算定用金額: 円未満四捨五入
- 月の概算総支給額: 円未満切り上げ
- 実給与明細との完全一致ではなく概算精度を目的とする
- 実給与との照合は給与支給後のβテスト項目

## Phase 7
メインメニューの「設定」を「バックアップ」に改称。
バックアップ画面内の各種設定項目名はそのまま維持。

---

## IMPLEMENTATION_PHASE4_RELEASE_FINISH.md

# Phase 4 公開前仕上げ（完成版）

作成日: 2026-07-29 JST

## 実装内容
- 組合員向け画面を「組合員向け売上目標管理」に統一。
- 今月の目標手取り、残り出番数、営業目標の丸め単位を利用者が入力し、「売上目標を保存」で給与月ごとに端末保存。
- 保存後も上記3項目をいつでも編集可能。
- 新しい給与月に保存値がない場合、前月の保存値を初期値として表示。上書き保存可能。
- 保存せず画面を離れた場合は、確認ダイアログを出さず変更を破棄。
- 給与月判定は2月14日締め、3月16日締め、その他15日締め。
- 勤務実績がない給与月は計算項目を「算出できません」と表示。
- 達成率は小数第1位。
- 勤務実績の保存・編集・削除および表示給与月の変更時に再計算。
- 手取り還元率を算出できない場合、固定還元率による代替計算は行わない。
- 必要な税込営収と残り出番あたりの必要営収は、1円・100円・1,000円単位の切り上げを利用者が選択可能。内部計算は丸め前の値を使用。
- 目標達成時は「残り出番あたりの必要営収はありません」と表示。
- 未達成かつ残り出番数0の場合は「―」のみ表示し、不安をあおるコメントを出さない。
- 残り出番数未入力の場合は「残り出番数を入力してください」と表示。
- 売上目標管理と給与シミュレーターの試算データは独立。
- 休憩タイマー・連続運転タイマー・連続運転警告は実装しない。給与計算用の通常休憩・深夜休憩入力は維持。

## データ保存
localStorageキー: `taxiPaySalesTarget:v1:YYYY-MM`

保存項目:
- `targetTakeHome`
- `remainingShifts`
- `rounding`
- `savedAt`

Google Driveへの保存・復元はv1.4の実装対象。

## 認証保護
以下の認証・基盤ファイルは変更していない。
- firebase-auth.js
- firebase-config.js
- boot.js
- diagnostics.js
- firestore.rules

---

## IMPLEMENTATION_PHASE56_DRIVE_BACKUP.md

# v1.4β Phase5・6 実装内容

- Google Drive接続（通常ログインとは分離）
- `current.json` 自動同期
- JST日時付き世代バックアップ
- Drive・端末ファイルからの復元
- 復元前の自動退避
- オフライン時のローカル保存継続
- オンライン復帰後の自動同期
- 全データの後方互換エクスポート／インポートAPI
- 営業目標の丸めを1,000円単位切り上げに固定
- 既存state・localStorageキーを維持し、削除・初期化処理を追加しない

---

## IMPLEMENTATION_PHASE56_DRIVE_LAZY_AUTH.md

# Phase5・6 Google Drive 遅延権限取得

Build: `20260820-02`  
作成日時: `2026/08/20 12:31:56 JST`

## 利用者操作

通常操作は「Google Driveへ同期」だけ。

事前の「Google Driveに接続」操作は廃止する。

## 初回

利用者が「Google Driveへ同期」を押したときに初めてDrive利用権限を要求する。
許可後、そのまま初回同期確認へ進む。

## 2回目以降

既にDrive利用を許可済みなら、同期ボタンを押した時点で必要なアクセストークンを取得する。
Google側が再同意を要求しない限り、初回と同じ同意画面を毎回表示しない。

## 原則

端末保存は従来どおり行う。
Google Driveへのデータ書き込みは、利用者が「Google Driveへ同期」を押した場合だけ行う。
自動同期は行わない。

OAuth Client IDは開発・管理側で設定し、一般利用者には設定させない。

---

## IMPLEMENTATION_PHASE56_MANUAL_DRIVE_SYNC_20260820.md

# Phase5・6 Google Drive同期・復元 仕様更新

Build: `20260820-01`  
作成日時: `2026/08/20 11:53:00 JST`

- 端末保存とGoogle Drive同期を完全に分離。自動同期は行わない。
- 利用者が［Google Driveへ同期］を押した時点の本人データ一式をスナップショット化。
- 同期1回につき世代バックアップ1件＋current.jsonを更新。
- 世代バックアップは90日保持。90日超は自動削除。
- 90日以内の世代も利用者が個別削除可能。削除前確認あり。
- バックアップ一覧に件数・合計容量、各世代の容量を表示。
- 復元前の端末データは端末内へ退避。復元だけではDriveを上書きしない。
- 端末名を利用者が設定可能。競合時に端末側／Drive側の保存元端末名・件数・対象期間・日時を比較表示。
- 初回同期時に同期対象と「管理者には勤務実績（売上や個人の給与に関わる設定等の全て）は送信されません」を表示。
- Google Drive API権限は `drive.file` を維持。
- ログイン不能時は、氏名・乗務員番号・変更先Googleアカウント＋診断ログをまとめてコピーできる変更申請導線を追加。
- ログイン中の利用者情報にもGoogleアカウント変更申請のコピー機能を追加。

## 注意
`google-drive-config.js` の `clientId` は空欄のままです。実際のDrive接続テスト前に、Google Cloud Consoleで発行済みのOAuth 2.0ウェブクライアントIDを設定してください。

---

## IMPLEMENTATION_PHASE75_APP_REGISTERED_NAME.md

# Phase7.5 アプリ登録氏名の表示統一

- Build: `20260817-01`
- 登録済みユーザー一覧では、Googleアカウントの表示名より `betaAllowlist.displayName` を優先。
- ユーザー詳細の氏名も、アプリの事前登録マスターに登録された氏名を優先。
- 既存の `users` ドキュメントは削除・初期化・一括書換えしない。
- 今後新規作成される `users` プロフィールも `betaAllowlist.displayName` を優先して保存。
- Firestoreルールは既存の厳密なv1.3βルールを維持し、Phase7.5の devices / loginHistory 権限だけを追加した版を同梱。

---

## IMPLEMENTATION_PHASE75_CACHE_UPDATE_FIX_R7.md

# Phase7.5 キャッシュ更新修正 r7

Build: `20260819-05`  
作成日時: `2026/08/19 12:27:27 JST`

## 今回特定した不整合

前回の差分版では `app-meta.js` / `app-meta.json` のBuildを更新した一方、
すべての実行HTMLを差分ZIPへ含めていなかったため、
ページによって古い `?v=` の参照が残る状態が発生し得た。

その結果、
- サーバー上の最新Buildは新しい
- ブラウザが読み込む `app-meta.js` は古い
- 「新しいバージョンがあります」が消えない

という不整合が起きた。

## 修正

- Build更新時は実行HTMLをすべて同じBuildへ同期
- 差分ZIPにも `index.html / admin.html / announcement.html / system-info.html` を必ず含める
- `app-meta.js / app-meta.json / phase75-ops.js / sw.js` を同一Buildで配布
- 更新クリック後は、再読込後の実Buildが対象Build以上になったことを確認してから成功表示
- 対象Buildを取得できていなければ通知を消さず「再試行」にする
- HTMLナビゲーション、app-meta、phase75-ops、swはService Worker側でも `no-store`
- Service Worker更新時は `updateViaCache: 'none'`

勤務実績・Firestore・利用者情報は変更しない。

---

## IMPLEMENTATION_PHASE75_DEVELOP_TITLE.md

# Phase7.5 DEVELOP環境タイトル識別

## 変更内容

開発環境を本番環境とタブ・PWA・画面上で識別できるよう、名称を次に統一しました。

- 開発版: `DEVELOP_タクシー給与シミュレーター`
- PWA短縮名: `DEVELOP_給与`
- Version: `1.4β`
- Build: `20260806-03`
- Environment: `DEVELOP`

本番環境へ反映する際は、タイトルを `タクシー給与シミュレーター`、Environmentを `PRODUCTION` とする別ビルドを使用してください。

---

## IMPLEMENTATION_PHASE75_FINAL_UI_ADJUSTMENT.md

# Phase7.5 最終UI調整

Build: `20260818-01`

## 修正内容
- ユーザー一覧の操作ボタンを機能ごとの固定位置に整列
  - 編集（青）
  - 管理者権限（紫）
  - 利用停止／利用再開（橙）
  - 削除（赤）
- 機能がない行には空きスロットを確保し、色・機能ごとの位置ずれを解消
- 「表示件数 10件／20件」が枠外にはみ出さないよう検索・絞り込み欄の幅を再調整
- 画面幅に応じて 6項目→3列→2列→1列へ自動調整

既存の検索、ソート、ページネーション、Firestoreデータには変更なし。

---

## IMPLEMENTATION_PHASE75_OPERATIONS_FOUNDATION.md

# Phase7.5 運用基盤完成版

- Version: 1.4β
- Build: 20260806-02
- Cache: taxi-pay-v1.4-beta-20260806-02-phase75
- Environment: URLからDEVELOP / PRODUCTIONを自動判定
- JST基準

## 実装
- Version・Build・Environmentの共通表示
- 最新Build自動判定と更新案内
- ログイン画面の自己復旧ボタン
- Service Worker／旧キャッシュの再構築
- 管理者向けシステム情報画面
- 利用者ごとの複数端末情報（180日）
- ログイン履歴（60日）
- ユーザー名クリックによる詳細表示
- 既存診断ログコピーの維持・Build情報強化

## データ保護
既存の勤務実績、控除設定、利用者情報、localStorageキーを削除・初期化しません。

## Firebaseルール
`users/{uid}/devices` と `users/{uid}/loginHistory` を追加したため、同梱の firestore.rules の反映が必要です。

---

## IMPLEMENTATION_PHASE75_PROFILE_DIAGNOSTICS_FINAL.md

# Phase7.5 利用者情報・診断機能 最終仕上げ

Build: `20260819-07`  
作成日時: `2026/08/19 12:52:36 JST`

## 利用者情報

「利用者情報」に一般利用者向けの「アプリ・診断情報」を追加。

表示：
- Version
- Build
- 公開日時
- Service Worker状態
- Cache Version

操作：
- 診断情報をコピー
- PWAキャッシュを再構築

診断コピーには給与額・勤務実績を含めない。

## Googleログイン失敗時

認証エラーを検知した場合、
通常のログイン画面に留めず「利用者情報」の診断モードへ自動遷移する。

診断モードでは本人情報を取得できないため、
氏名・乗務員番号・勤務実績などは表示しない。

表示：
- Version / Build / 公開日時
- Service Worker
- Cache Version
- 認証エラー

操作：
- 診断情報をコピー
- Googleログインを再試行
- PWAキャッシュを再構築

## 診断情報

主な内容：
- Version / Build / Environment / Cache Version
- Service Worker状態
- アプリ用Cache Storage名
- URL / User Agent / Online / PWA起動
- 認証エラーコード・メッセージ
- 直近の認証診断ログ・アプリ診断ログ

氏名、給与額、勤務実績は診断コピー対象外。

---

## IMPLEMENTATION_PHASE75_UNIFIED_USER_LIST.md

# Phase7.5 管理画面 ユーザー一覧統合

## 実装内容
- 事前登録ユーザーと登録済みユーザーを「ユーザー一覧」に統合
- 氏名、Googleアカウント、乗務員番号、営業所の横断検索
- 登録状態（未登録／登録済み）、利用状態、権限の絞り込み
- 氏名、営業所、乗務員番号、登録状態、登録日時、最終利用による並び替え
- 1ページ10件／20件の表示切替
- 前後ページ・ページ番号によるページ切替
- 登録済みユーザーの氏名タップで既存のユーザー詳細を表示
- 既存のFirestoreデータ構造・権限ルールは変更しない

## 内部実装
既存の事前登録・登録済み管理処理を維持し、管理画面上で両データを統合表示します。既存の編集・利用停止・管理者権限・削除処理は従来処理へ委譲しているため、管理操作の意味は変更していません。

---

## IMPLEMENTATION_PHASE75_UPDATE_NOTICE_FIX.md

# Phase7.5 最新版通知の残留修正

Build: `20260817-03`

## 現象
「キャッシュを更新して最新版を取得」を押すと最新版へ更新されるが、
「新しいバージョンがあります」の通知が画面に残り続けることがあった。

## 原因
`app-meta.js` と `phase75-ops.js` の読み込みURLに古い固定クエリが残っており、
ブラウザのHTTPキャッシュから旧Build情報を再利用する場合があった。

## 修正
- 全HTMLで `app-meta.js` / `phase75-ops.js` の読み込みクエリをBuild `20260817-03` に統一
- 更新ボタン押下時に通知を即時非表示
- PWAキャッシュとService Workerを削除後、キャッシュバスター付きURLへ遷移
- 最新Buildと一致している場合は残留通知を自動削除
- Service Workerキャッシュ版を `taxi-pay-v1.4-beta-20260817-03-update-notice-fix` に更新

勤務実績・利用者情報・Firestoreデータには変更なし。

---

## IMPLEMENTATION_PHASE75_UPDATE_NOTICE_FIX_R4.md

# Phase7.5 最新版通知の再表示対策

Build: `20260817-04`

## 修正
更新ボタンで取得した最新Buildを `localStorage` に記録します。

再読込直後に旧 `app-meta.js` がブラウザ側に一時的に残った場合でも、
サーバー側の最新Buildが「更新実行済みBuild」と同じなら最新版通知を再表示しません。

さらに、
- 更新時にPWAキャッシュを削除
- Service Workerを全登録解除
- 更新通知DOMを即時削除
- `app-meta.json` は `no-store` + `no-cache` で取得
- HTML側の `app-meta.js` / `phase75-ops.js` 読込番号をBuildと同期

としています。

Firestore・利用者データ・勤務実績は変更しません。

---

## IMPLEMENTATION_PHASE75_UPDATE_NOTICE_FIX_R5.md

# Phase7.5 最新版通知のアプリ単位制御

Build: `20260817-05`

## 現象
ログイン画面で最新版通知を処理した後、ユーザー管理など別ページへ遷移すると、
同じBuildの「キャッシュを更新して最新版を取得」が再表示されることがあった。

## 原因
各HTMLページで最新版チェックが独立実行されていたため、
ページ遷移ごとに同じBuildが再評価されていた。

## 修正
`localStorage` に以下を保持し、アプリ全体で共通判定する。

- `taxiPayLatestBuildSeen`
  - そのBuildの通知をすでに表示したか
- `taxiPayLatestBuildUpdated`
  - そのBuildへの更新操作をすでに実行したか

同じBuildについては、
- 通知はアプリ全体で1回だけ
- 更新操作後は別ページへ遷移しても再表示しない
- 本当に新しいBuildが公開された場合だけ再度通知

Firestore、勤務実績、利用者情報には変更なし。

---

## IMPLEMENTATION_PHASE75_UPDATE_NOTICE_FIX_R6.md

# Phase7.5 更新通知・最新版取得 修正 r6

Build: `20260819-02`  
作成日時: `2026/08/19 00:47:15 JST`

## 修正
- 更新通知を認証画面などの再描画領域から外し、body直下に固定
- 「通知を一度表示したか」ではなく、実際に読み込まれているBuildと最新Buildを比較
- 古いBuildのままなら通知を消さない
- 更新ボタン押下時にアプリ用Cache Storageを削除
- Service Workerのupdateを明示実行
- 更新後は必ず `index.html` をタイムスタンプ付きURLで取得
- Service Worker登録時に `updateViaCache: 'none'` を使用
- Service Workerの `SKIP_WAITING` メッセージに対応
- ページ復帰時・pageshow時にも最新版確認

勤務実績・控除設定・利用者情報などのLocalStorage/Firestoreデータは削除しません。

---

## IMPLEMENTATION_PHASE7_R2.md

# Phase7 r2

- ログイン・ログアウト成功通知を1秒に変更（エラーは12秒を維持）
- スマホのハンバーガーメニューへ管理者専用「ユーザー管理」を追加
- 管理者画面へ「お知らせ管理」を追加
  - 掲載開始・終了（JST）
  - テキスト入力
  - 掲載の有効／無効
  - 掲載期間中の一般利用者ログイン停止
- ログイン停止中も管理者は管理画面へアクセス可能
- Firestore `appSettings/systemAnnouncement` は公開読み取り、管理者のみ書き込み

注意: FirestoreルールをFirebaseへ反映しないと、未ログイン画面でアナウンスを取得できません。

---

## IMPLEMENTATION_PHASE7_R3.md

# Phase7 r3 お知らせ管理

## 変更内容
- 管理者画面の名称を「改修アナウンス」から「お知らせ管理」へ変更
- タイトル入力を追加
- 重要度を追加（重要／お知らせ／情報）
- 発信元を将来拡張可能なデータ構造に変更
  - 現時点は `sourceType: system`、`sourceLabel: システム管理者` 固定
  - 将来は組合管理者からのお知らせを追加可能
- 一般利用者のログイン停止権限はシステム管理者のお知らせに限定する前提
- 掲載日時と更新日時はJSTで保存
- スマホでも1列レイアウトで入力可能

## 互換性
- Firestoreの保存先 `appSettings/systemAnnouncement` は変更しない
- 既存データにタイトル・重要度・発信元がない場合も読み込み可能
- 既存の認証、利用者データ、勤務実績、控除設定の構造は変更しない

---

## IMPLEMENTATION_PHASE7_R4.md

# Phase7 r4

- PC版・スマホ版の機能を共通化し、レイアウトのみ画面幅に応じて最適化する方針を明文化。
- 「お知らせ管理」をユーザー管理から分離し、独立ページ `announcement.html` とした。
- PCヘッダーとスマホのハンバーガーメニューの双方に、管理者専用「お知らせ管理」を追加。
- ユーザー管理画面からもお知らせ管理へ移動可能。
- お知らせ管理はスマホ・PCの双方で、タイトル、重要度、掲載期間、本文、掲載有効化、一般利用者ログイン停止を操作可能。
- 現時点の発信元・編集権限はシステム管理者のみ。将来の組合管理者対応用フィールドは維持。
- 既存の保存先 `appSettings/systemAnnouncement` と既存データ構造を維持。

---

## IMPLEMENTATION_PHASE7_R5.md

# Phase7 r5

## 修正内容
- お知らせ管理画面のチェックボックスに共通入力欄の幅100%指定が適用され、スマホで説明文が縦に崩れる問題を修正。
- チェックボックスを固定幅、説明文を可変幅とする2列グリッドへ変更。
- PC・スマホ双方で同じ機能と読みやすい横書きを維持。
- Service Workerキャッシュ名とCSS読み込みバージョンを更新。

## データ影響
- 認証、Firestore、localStorage、お知らせデータ構造には変更なし。

---

## IMPLEMENTATION_PHASE7_R6_STABILIZATION.md

# Phase7 r6 安定化修正

- ユーザー管理画面から旧お知らせ管理処理を除去
- お知らせ管理を `announcement.html` / `announcement-admin.js` に完全分離
- `admin.js` のログイン後初期化はユーザー管理データだけを読み込む
- お知らせ管理画面のHTML要素存在確認を追加
- Service Workerへ `announcement-admin.js` を追加
- キャッシュ版を `taxi-pay-v1.4-beta-20260805-phase7-r6` に更新
- Firebase Authentication、既存Firestore文書、localStorage保存形式は変更しない

---

## IMPLEMENTATION_PHASE7_R7_SAFARI_AUTH.md

# Phase7 r7 Safari認証安定化

## 修正対象

iPhone Safariでページ再読み込み後にGoogleログインを実行すると、`auth/popup-blocked` になる問題。

## 原因

ログインボタンのタップ後に `setPersistence()` の完了を待ってから `signInWithPopup()` を呼んでいたため、Safariがポップアップを直接のユーザー操作として扱わない場合があった。

## 修正

- Persistence設定は従来どおりアプリ起動時に実施。
- ログインボタン押下時のFirestoreお知らせ再取得と、重複したPersistence設定を削除。
- iPhone Safariではタップ直後に `signInWithPopup()` を呼ぶ。
- PC・iPhone Chrome・Firestore・既存データ構造は変更しない。
- Service Workerキャッシュ名と認証モジュール読込番号を更新。

## テスト項目

1. iPhone Safariで開く。
2. ページを再読み込みする。
3. Googleログインを押す。
4. Googleアカウント選択画面が開くことを確認する。
5. ログイン後、勤務実績画面が表示されることを確認する。
6. PC ChromeとiPhone Chromeでもログインできることを確認する。

---

## IMPLEMENTATION_PHASE7_R8_AUTH_TRANSITION.md

# Phase7 r8 管理画面遷移時の認証表示安定化

- ユーザー管理・お知らせ管理を開いた直後は、Googleログイン画面ではなく「ログイン状態を確認しています…」を表示します。
- Firebaseの認証状態確認後、ログイン済み管理者は管理画面を直接表示します。
- 未ログインまたは権限不足の場合だけGoogleログイン画面を表示します。
- Firebase Authentication、Firestore構造、既存利用者データは変更していません。

---

## IMPLEMENTATION_PHASE7_UI_UX.md

# Phase7 画面最適化（UI・UX改善）

## 実装内容
- 勤務実績ページをアコーディオン化
- 控除額設定を「税額計算に必要な設定／法定控除／任意控除／その他控除」に分割
- 登録待ちユーザーと登録済みユーザーの画面を視覚的に分離
- 各ユーザー一覧に検索・絞り込みを追加
- 営業目標の丸めを1,000円単位固定（既存JS互換のためhidden値を保持）
- スマートフォン表示を最適化

## データ保護
localStorageキー、Firestoreコレクション、入力要素ID、保存データ構造は変更していません。
アコーディオンの開閉状態はsessionStorageの別キーにのみ保存されます。


## 2026-08-04 修正 r1
- アコーディオン化で欠落した `reportTitle` を給与シミュレーション結果内へ復元。
- `app.js` が参照するDOM IDと `index.html` を再照合し、欠落がないことを確認。
- Service Workerのキャッシュ名とPhase7関連のクエリ文字列を更新。
- 認証・Firestore・既存保存データ構造は変更していない。

---

## IMPLEMENTATION_PHASE8.md

# Phase 8 月次集計ダッシュボード
Build: `20260824-12`
作成日時: `2026/08/24 21:49:18 JST`

- 月次集計画面内に推移グラフを追加
- 表示期間: 3か月 / 6か月 / 12か月 / 全期間
- 第1軸の指標を切替可能
- 「第2軸を追加表示」で別指標を重ねて比較可能
- 第2軸は破線表示、非表示へ戻せる
- 指標: 税込営収 / 概算総支給 / 概算手取り / 時間あたり手取り / 実質還元率 / 手取り還元率
- 当月は「進行中」としてグラフ・表に表示
- グラフ下に月別数値一覧
- 今後の締め履歴には grossPay / workMinutes / breakMinutes も保存
- 過去の旧形式締め履歴で保存されていない値は「—」表示

---

## IMPLEMENTATION_PHASE8_PERIOD_TAP_INPUT.md

# Phase 8 / 勤務実績入力UI更新
Build: `20260824-13`
作成日時: `2026/08/24 22:44:28 JST`

## Phase 8
- 表示期間: 当月 / 3か月 / 6か月 / 12か月 / 全期間
- 独立した「期間指定」機能を追加
- 期間指定は開始日・終了日で勤務実績を絞り込み
- 今後の給与締め履歴には dailyEntries を保存し、任意期間表示に利用
- 旧締め履歴に日別データがない場合は表示可能な範囲のみ対象

## 勤務実績入力
- 出勤・退勤を「時」「分」のタップ式数字入力へ変更
- 通常休憩・深夜休憩もタップ式数字入力へ変更
- OSソフトウェアキーボードは表示しない
- 自動カーソル移動なし
- 休憩の「分」は60以上も入力可能
- 休憩グループから離れた時または保存時に正規化
  例: 2時間78分 → 3時間18分
- 通常休憩+深夜休憩が拘束時間の1/3以上なら確認警告

---

## IMPLEMENTATION_REVENUE_ADJUSTMENT_INPUT.md

# 営収調整入力機能

Build: `20260818-02`  
作成日時: `2026/08/18 23:52:46 JST`

## 計算式

給与計算用税込営収
= 総営収（税込）
+ その他（＋）
- その他（－）
- A空転
- B空転

## 保存項目

- `grossSales` : 日報の総営収（税込）
- `otherPlus` : その他（＋）
- `otherMinus` : その他（－）
- `idleA` : A空転
- `idleB` : B空転
- `adjustedGrossSales` : 給与計算用税込営収
- `grossRevenue` : 既存機能との互換用。`adjustedGrossSales` と同じ値を保存

## 既存データ互換

過去データに新項目がない場合は、

- `grossSales = grossRevenue`
- 調整4項目 = 0
- `adjustedGrossSales = grossRevenue`

として自動的に読み込みます。

既存の勤務実績を削除・初期化・一括変換しません。

## UI

通常は
- 総営収（税込）
- 給与計算用営収（自動）
- 税抜営収（自動）

を表示します。

調整が必要な場合のみ
「営収調整の内訳を入力（必要な場合）」を開き、
4項目を入力します。

CSV出力にも総営収・各調整額・給与計算用営収を追加しました。

---

## IMPLEMENTATION_REVENUE_ADJUSTMENT_UI_ORDER.md

# 営収調整入力 UI順序・直接入力修正

Build: `20260819-01`  
作成日時: `2026/08/19 00:25:26 JST`

## 修正内容

営収調整の入力順を以下に変更。

1. A空転
2. B空転
3. その他（＋）
4. その他（－）

4項目は `type="number"` をやめ、`inputmode="numeric"` の直接数字入力欄へ変更。
ブラウザが表示する1円単位の上下矢印（スピンボタン）は表示しない。

入力中に数字以外が入った場合は自動的に除去する。

## 計算

給与計算用税込営収
= 総営収
- A空転
- B空転
+ その他（＋）
- その他（－）

計算結果は従来と同一。
Firestore・既存勤務実績・保存データ構造は変更しない。

---

## IMPLEMENTATION_REVENUE_UI_AND_UPDATE_MESSAGE.md

# 営収入力UI再編・最新版取得完了メッセージ

Build: `20260819-03`  
作成日時: `2026/08/19 01:25:11 JST`

## 営収入力

表示順を以下へ変更。

1. 総営収（税込）
2. 営収調整
   - A空転
   - B空転
   - その他（＋）
   - その他（－）
3. 給与計算用営収（税込・自動）
4. 税抜営収（自動）

営収調整は折りたたまず常時表示する。

説明文：
「日常点検表のA空転・B空転・その他（＋）・その他（－）の金額をそのまま入力してください。記載がない項目は0円です。」

計算式・保存データ構造・既存データ互換性は変更しない。

## 最新版取得

キャッシュ更新・最新版取得後に、

「最新版に更新しました。 Build XXXXXXXX-XX」

を5秒間表示する。

表示後はURLから更新用パラメータを削除するため、
通常の再読込では完了メッセージを再表示しない。

---

## IMPLEMENTATION_SYSTEM_INFO_AUTH_RECOVERY.md

# システム情報 認証復旧

Build: `20260819-06`  
作成日時: `2026/08/19 12:33:44 JST`

## 障害原因

Service Worker診断を追加した際に `system-info.js` を全面置換し、
既存のFirebase認証・管理者権限判定を削除してしまった。

その結果、`body.auth-checking` を解除する処理が実行されず、
F5更新後に「ログイン状態を確認しています…」のまま停止した。

## 復旧内容

- Firebase Authを復元
- `onAuthStateChanged` を復元
- Firestore `admins/{uid}` による管理者判定を復元
- 認証成功後のみシステム情報画面を表示
- 認証失敗時はGoogleログイン画面を表示
- Service Worker診断は認証処理の後に実行
- Service Worker → Cache Storage の順で診断
- 「情報を再取得」で診断を再実行
- PWAキャッシュ再構築も維持

勤務実績・利用者情報・Firestoreデータは変更しない。

---

## IMPLEMENTATION_SYSTEM_INFO_SW_DIAGNOSTIC_FIX.md

# システム情報 Service Worker・キャッシュ診断修正

Build: `20260819-04`  
作成日時: `2026/08/19 12:18:17 JST`

## 診断順序

1. Service Worker登録処理を実行
2. 登録完了または登録失敗を確定
3. Service Worker状態を取得
4. Cache Storage一覧を取得
5. システム情報画面へ表示

「情報を再取得」ボタンでも上記処理を最初から再実行する。

## 表示

Service Workerは以下を区別する。

- 登録中…
- 登録済み
- 登録失敗
- 非対応

登録済みの場合は、
`active / activated`
`waiting / installed`
`installing / installing`
などWorker状態も表示する。

## PWAキャッシュ再構築

アプリ用Cache Storageを削除し、
Service Workerの登録・更新処理を再実行してから
診断情報を再取得する。

勤務実績・利用者情報・Firestoreデータは変更しない。

---

## 2026-08-27 データ保全・復旧・端末識別

- data-integrity-v14.js: 保存前の由来情報付与、削除検出、退避、tombstone、競合計画・解決。
- data-recovery-v14.js: Google Drive非依存の標準復旧UI、差異一覧・詳細選択、バックアップ、退避管理。
- device-registry-v14.js: 端末名の一意登録、既存端末ID引継ぎ、ブラウザ追跡、Drive利用条件。
- phase56-drive-backup.js: current.json上書き前の比較・競合解決と統合済みスナップショット保存。
- UI: バックアップ見出し修正、給与月ナビを勤務実績上部へ移動、iOSカスタム数字キーのdouble-tap zoom抑止。
