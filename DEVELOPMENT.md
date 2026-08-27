# 開発ガイド — Version 1.4β

## 目的

現行コード・現行仕様・回帰テストだけを見れば開発を継続できる状態を維持する。旧版の一時ファイルや診断コピーを現行ツリーへ増殖させない。

## 開発の正本

- 現行仕様: `SPEC_v1.4beta.md`
- 実装履歴: `IMPLEMENTATION_HISTORY_v1.4beta.md`
- 変更概要: `CHANGELOG.md`
- アプリ本体: `index.html` / `app.js` / `styles.css`
- 保存保護: `storage-safety.js`
- データ保全・競合・退避: `data-integrity-v14.js`
- 標準復旧: `data-recovery-v14.js`
- 端末識別: `device-registry-v14.js`
- Driveバックアップ: `phase56-drive-backup.js`
- 認証・利用者管理: `firebase-auth.js` / `firestore.rules`
- 回帰テスト: `tests/regression-v14.cjs` / `tests/regression-storage-v14.cjs`

## 変更手順

1. `main` から作業ブランチを作る。
2. 変更前に関連する保存キー、旧データ移行、保存・削除・復元、Drive、端末差、認証、PWAキャッシュへの影響を確認する。
3. コードを変更する。
4. 仕様変更は `SPEC_v1.4beta.md`、実装内容は `IMPLEMENTATION_HISTORY_v1.4beta.md` へ追記する。個別の仕様書・実装メモファイルを新規作成しない。
5. GitHub Actionsの回帰ゲートを実行する。
6. 構文チェック、コア回帰、保存層回帰、静的結合チェックがすべて成功したことを確認する。
7. 必要な実機確認を行う。
8. 全確認完了後にのみ `main` へ反映する。

## 絶対ルール

- 既存データを破壊しない。
- 回帰テスト完了前に完成扱いしない。
- 旧Buildの退避コピーを `*-bXX.js` のような名前で残さない。必要ならGit履歴を使う。
- 一時診断HTML・一時README・SHA256固定ファイルを恒久ファイルとして増やさない。
- 復旧・競合処理ではユーザー判断前にデータを完全削除しない。
- 日時記録はJST基準を維持する。

## 一時互換ファイル

`production-data-recovery.html` と `production-rescue-restore.html` は、既存テスターへの復旧URL互換のため一時的に残している。標準復旧機能への移行完了後、利用状況を確認して削除する。

## リポジトリ整理方針

Gitは履歴そのものがバックアップなので、現行ツリーには「現在の実行に必要」「現在の開発に必要」「現行仕様として参照する」のいずれかに該当するファイルだけを残す。過去Buildや一時調査資料を参照する必要がある場合はGit履歴から取得する。
