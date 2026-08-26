# 回帰確認 — Build 20260826-14

## 自動確認済み
- storage-safety.js 単体テスト: 新規、V10、V9移行、空V10+旧データ、破損V10+旧データ、破損のみ書込禁止、DEVELOP/PRODUCTION分離、保存前スナップショット。
- 全JavaScriptファイル `node --check`: PASS。
- index.html のローカル src/href 参照ファイル存在確認: PASS。
- Service Worker のプリキャッシュ対象ファイル存在確認: PASS。
- 給与計算ロジック部分は変更なし（保存層・Drive復元・キャッシュ識別子・読込順のみ変更）。

## ライブ環境で必要な最終確認
GitHub PagesへDEVELOP版を配置した後に、iPhone Chrome / PC Chromeで以下を確認する。
1. 既存勤務実績が表示されること。
2. 新規勤務実績を1件保存し、再読込後も残ること。
3. 月次集計・グラフが表示されること。
4. 設定保存、控除設定が残ること。
5. Googleログイン/ログアウト。
6. Google DriveはPCでバックアップ→一覧→復元前確認まで、スマホでは既知の認証問題を再確認。
7. DEVELOPで保存してもPRODUCTION側localStorageが変更されないこと。

本番反映は上記ライブ確認後に行う。
