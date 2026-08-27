#!/usr/bin/env python3
from pathlib import Path
import sys, re, datetime
ROOT=Path(__file__).resolve().parents[1]
APPLY='--apply' in sys.argv

def read(p): return (ROOT/p).read_text(encoding='utf-8')
def write(p,s):
    if APPLY:(ROOT/p).write_text(s,encoding='utf-8')
def replace_once(text,old,new,label):
    n=text.count(old)
    if n!=1: raise SystemExit(f'{label}: expected 1 match, found {n}')
    return text.replace(old,new,1)

# --- index.html: load integrity before app, make Backup wording correct, move month nav, add v1.4 modules ---
p='index.html'; s=read(p)
s=replace_once(s,'<script src="app-meta.js?v=20260826-18"></script><script src="storage-safety.js?v=20260826-18"></script>',
'''<script src="app-meta.js?v=20260827-01"></script><script src="storage-safety.js?v=20260827-01"></script><script src="data-integrity-v14.js?v=20260827-01"></script>''','index integrity load')
s=s.replace('?v=20260826-18','?v=20260827-01')
s=replace_once(s,'<section class="app-view" data-view-panel="work"><div class="view-heading"><h2>勤務実績</h2><p>勤務実績の入力、日別明細、給与シミュレーターを確認します。</p></div>',
'''<section class="app-view" data-view-panel="work"><div class="view-heading"><h2>勤務実績</h2><p>勤務実績の入力、日別明細、給与シミュレーターを確認します。</p></div><section class="card no-print month-navigation-card" aria-label="給与月の切り替え"><div class="month-navigation-title"><strong>表示する給与月</strong><small>前月・次月へ移動できます</small></div><div class="month-row"><button class="ghost" id="prevMonth" type="button">← 前給与月</button><input id="currentMonth" type="month"/><button class="ghost" id="nextMonth" type="button">翌給与月 →</button></div></section>''','month nav top')
s=replace_once(s,'<div class="month-row no-print"><button class="ghost" id="prevMonth">前給与月</button><input id="currentMonth" type="month"/><button class="ghost" id="nextMonth">翌給与月</button></div>','', 'remove old month nav')
s=replace_once(s,'<section class="app-view" data-view-panel="settings" hidden=""><div class="view-heading"><h2>設定</h2><p>アプリ全体の動作設定です。</p></div>',
'''<section class="app-view" data-view-panel="settings" hidden=""><div class="view-heading"><h2>バックアップ</h2><p>Google Driveへのバックアップ・復元、端末ファイルからの過去データ復旧を管理します。</p></div>''','backup heading')
# Drive device name is now managed under 利用者情報. Keep only status/help here.
old='''<label>この端末の名前<input id="driveDeviceName" maxlength="40" placeholder="例：自宅PC / iPhone" type="text"/></label><div class="actions"><button class="secondary" id="saveDriveDeviceName" type="button">デバイス名を保存</button></div>'''
new='''<p class="note">端末名は「利用者情報」で端末ごとに設定します。端末名が未設定の間はGoogle Driveの保存・同期・復元を実行できません。</p>'''
s=replace_once(s,old,new,'drive device UI')
# v1.4 modules: recovery before Drive so Drive can use conflict resolver; registry is module and listens to auth events.
marker='<script src="google-drive-config.js?v=20260827-01"></script><script src="phase56-drive-backup.js?v=20260827-01"></script>'
s=replace_once(s,marker,'<script src="google-drive-config.js?v=20260827-01"></script><script src="data-recovery-v14.js?v=20260827-01"></script><script type="module" src="device-registry-v14.js?v=20260827-01"></script><script src="phase56-drive-backup.js?v=20260827-01"></script>','v14 module load')
write(p,s)

# --- styles.css: prevent iOS double-tap zoom on custom keypad; make month nav obvious; v1.4 recovery/device UI ---
p='styles.css'; s=read(p)
append='''\n\n/* v1.4β 2026-08-27: human-error-safe navigation, device registry, recovery */
.tap-number-pad button,.tap-number-grid button,#tapBreakUnits button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.month-navigation-card{position:relative;border:2px solid rgba(15,76,92,.22);background:#f8fbfc}
.month-navigation-title{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:8px}.month-navigation-title small{color:var(--muted)}
.month-navigation-card .month-row{margin:0}.month-navigation-card .month-row button{min-width:120px}
.device-id-short{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.78rem;overflow-wrap:anywhere}
.registered-device-list{display:grid;gap:7px;padding-top:8px}.registered-device-list>div{display:flex;justify-content:space-between;gap:12px;padding:8px;background:#f5f8f9;border-radius:8px}.registered-device-list small{color:var(--muted)}
.v14-conflict-row{width:100%;display:grid;grid-template-columns:minmax(90px,.8fr) minmax(0,2fr) auto;gap:10px;align-items:center;text-align:left;margin:7px 0;background:#fff;color:#17212b;border:1px solid var(--border)}.v14-conflict-row.resolved{border-color:#48895a;background:#eef8f0}.v14-conflict-row small{color:var(--muted)}
.v14-diff-list{display:grid;gap:10px}.v14-diff-row{padding:10px;border:1px solid var(--border);border-radius:10px}.v14-diff-row>strong{display:block;margin-bottom:7px}.v14-diff-row>div{display:grid;grid-template-columns:minmax(90px,.7fr) minmax(0,1.3fr);gap:8px;padding:5px 0}.v14-diff-row span{color:var(--muted)}
.v14-archive-row{display:flex;gap:10px;align-items:flex-start;padding:9px;border-bottom:1px solid var(--border)}.v14-archive-row input{width:auto;margin-top:4px}.v14-archive-row span{display:grid}.v14-archive-row small{color:var(--muted)}
#v14RecoveryFile{margin:8px 0}.v14-conflict-dialog{max-width:720px;width:min(94vw,720px);max-height:90vh;overflow:auto}
@media(max-width:640px){.month-navigation-title{display:grid}.month-navigation-card .month-row{display:grid;grid-template-columns:1fr 1fr}.month-navigation-card .month-row input{grid-column:1/-1;grid-row:1}.month-navigation-card .month-row button{min-width:0;font-size:.9rem}.v14-conflict-row{grid-template-columns:1fr auto}.v14-conflict-row strong{grid-column:1/-1;grid-row:2}.v14-diff-row>div{grid-template-columns:1fr}.registered-device-list>div{display:grid}}
'''
if 'v1.4β 2026-08-27: human-error-safe' not in s:s+=append
write(p,s)

# --- diagnostics: existing tester reminder must be brief ---
p='diagnostics.js'; s=read(p)
s=replace_once(s,"const duration = kind === 'error' ? 12000 : (code === 'AUTH-SIGNIN-OK' || code === 'AUTH-SIGNOUT-OK' ? 1000 : 4500);",
"const duration = kind === 'error' ? 12000 : (code === 'DEVICE-NAME-REMINDER' ? 1800 : (code === 'AUTH-SIGNIN-OK' || code === 'AUTH-SIGNOUT-OK' ? 1000 : 4500));",'diagnostic reminder duration')
write(p,s)

# --- firebase-auth: registered device records must not expire; add visible device name metadata when available ---
p='firebase-auth.js'; s=read(p)
old="""    const now=Date.now(), deviceLimit=180*86400000, historyLimit=60*86400000;
    for(const [name,limitMs] of [['devices',deviceLimit],['loginHistory',historyLimit]]){
      const snap=await getDocs(collection(db,'users',user.uid,name));
      await Promise.all(snap.docs.filter(d=>{const x=d.data();const ts=x.lastSeenAt?.toMillis?.()||x.occurredAt?.toMillis?.()||0;return ts&&now-ts>limitMs;}).map(d=>deleteDoc(d.ref)));
    }"""
new="""    // v1.4β: devices are persistent identity records used for reassociation after browser-data loss or device replacement.
    // Do not age them out. Login history remains a short operational log.
    const now=Date.now(), historyLimit=60*86400000;
    const snap=await getDocs(collection(db,'users',user.uid,'loginHistory'));
    await Promise.all(snap.docs.filter(d=>{const x=d.data();const ts=x.occurredAt?.toMillis?.()||0;return ts&&now-ts>historyLimit;}).map(d=>deleteDoc(d.ref)));"""
s=replace_once(s,old,new,'firebase device retention')
old="return {deviceId:getDeviceId(),os,browser,userAgent:ua,launchMode:(matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)?'pwa':'browser',screenWidth:window.screen?.width||0,screenHeight:window.screen?.height||0,viewportWidth:innerWidth,viewportHeight:innerHeight,appVersion:meta.version||'',build:meta.build||'',environment:meta.environment||'',lastSeenAtJst:new Date().toLocaleString('ja-JP',{timeZone:'Asia/Tokyo'}),lastSeenAt:serverTimestamp()};"
new="return {deviceId:getDeviceId(),deviceName:String(localStorage.getItem('taxiPayDeviceNameV2')||''),os,browser,userAgent:ua,launchMode:(matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)?'pwa':'browser',screenWidth:window.screen?.width||0,screenHeight:window.screen?.height||0,viewportWidth:innerWidth,viewportHeight:innerHeight,appVersion:meta.version||'',build:meta.build||'',environment:meta.environment||'',lastSeenAtJst:new Date().toLocaleString('ja-JP',{timeZone:'Asia/Tokyo'}),lastSeenAt:serverTimestamp()};"
s=replace_once(s,old,new,'firebase device name')
write(p,s)

# --- phase56 Drive: use unified required device name and merge local/Drive state before overwriting current.json ---
p='phase56-drive-backup.js'; s=read(p)
s=s.replace("const DEVICE_KEY = IS_DEVELOP?'taxiPayDevelopDeviceNameV1':'taxiPayDeviceNameV1';","const DEVICE_KEY = 'taxiPayDeviceNameV2';")
old="""  function defaultDeviceName() {
    const ua = navigator.userAgent;
    if (/iPhone|iPad/.test(ua)) return 'iPhone / iPad';
    if (/Android/.test(ua)) return 'Android';
    if (/Windows/.test(ua)) return 'Windows PC';
    if (/Macintosh/.test(ua)) return 'Mac';
    return 'この端末';
  }

  function deviceName() {
    return localStorage.getItem(DEVICE_KEY) || defaultDeviceName();
  }

  function saveDeviceName() {
    const value = $('driveDeviceName')?.value.trim();
    if (!value) {
      msg('driveSyncMessage', 'デバイス名を入力してください。', 'error');
      return;
    }
    localStorage.setItem(DEVICE_KEY, value);
    msg('driveSyncMessage', 'デバイス名を端末に保存しました。', 'success');
  }"""
new="""  function deviceName() {
    return String(window.TaxiPayDeviceRegistry?.getCurrent?.().deviceName || localStorage.getItem(DEVICE_KEY) || '').trim();
  }
  function requireDeviceName() {
    if (deviceName()) return true;
    window.TaxiPayDeviceRegistry?.requireNamedDevice?.();
    msg('driveSyncMessage', 'Google Driveを利用する前に「利用者情報」でこの端末の名前を設定してください。', 'error');
    return false;
  }"""
s=replace_once(s,old,new,'drive device functions')
s=s.replace("    if ($('driveDeviceName') && !$('driveDeviceName').value) {\n      $('driveDeviceName').value = deviceName();\n    }\n\n",'')
s=s.replace("    $('saveDriveDeviceName')?.addEventListener('click', saveDeviceName);\n",'')
s=replace_once(s,"  async function syncNow() {\n    if (syncing) return;","  async function syncNow() {\n    if (syncing) return;\n    if (!requireDeviceName()) return;",'drive sync gate')
s=replace_once(s,"  async function refreshBackups() {\n    const root = $('driveBackupList');","  async function refreshBackups() {\n    const root = $('driveBackupList');\n    if (!requireDeviceName()) return;",'drive refresh gate')
s=replace_once(s,"  async function restoreDrive(id) {\n    const accepted = confirm(","  async function restoreDrive(id) {\n    if (!requireDeviceName()) return;\n    const accepted = confirm(",'drive restore gate')
s=replace_once(s,"  function restoreSafety() {\n    try {","  function restoreSafety() {\n    if (!requireDeviceName()) return;\n    try {",'drive safety restore gate')
# enrich payload provenance
s=replace_once(s,"      deviceName: deviceName(),\n      appVersion:","      deviceName: deviceName(),\n      deviceId: window.TaxiPayDataIntegrity?.deviceId?.() || '',\n      browser: window.TaxiPayDataIntegrity?.browserName?.() || '',\n      appVersion:",'drive payload provenance')
# Merge remote state before generation/current upload. Preserve user decisions and archive losing records.
old="""      // 「バックアップ」ボタンを押した瞬間の状態を固定する。
      const snapshot = JSON.parse(JSON.stringify(currentPayload));

      // 1回のバックアップにつき1世代を作成。
      const backupName = `backup-${jstStamp()}.json`;
      await uploadJson(backupName, snapshot);

      // current.json は最新版として上書き。
      const currentFile = await findFile('current.json');
      await uploadJson('current.json', snapshot, currentFile?.id || '');"""
new="""      // Drive current.json がある場合は、上書き前に端末データと比較・統合する。
      // 日時だけで勝者を決めず、内容が異なる競合は利用者が選択する。
      const currentFile = await findFile('current.json');
      if (currentFile && window.TaxiPayRecoveryV14?.resolveStates) {
        const remote = await readDrive(currentFile.id);
        if (remote?.data?.state) {
          const resolved = await window.TaxiPayRecoveryV14.resolveStates(
            currentPayload.data.state,
            remote.data.state,
            {local: deviceName() || 'この端末', remote: remote.deviceName || 'Google Drive'}
          );
          if (!resolved) {
            msg('driveSyncMessage', '競合確認がキャンセルされたため、Google Driveは変更していません。', 'info');
            return;
          }
          const before = storageApiSnapshot();
          try {
            window.TaxiPayStorageSafety.save(resolved.state, 'drive-merge');
          } catch (mergeError) {
            if (before !== null) localStorage.setItem(window.TaxiPayStorageSafety.primaryKey, before);
            throw mergeError;
          }
        }
      }

      // 利用者が競合を解決した後の端末状態を、今回の確定スナップショットとする。
      const snapshot = JSON.parse(JSON.stringify(payload()));

      // 1回のバックアップにつき1世代を作成。
      const backupName = `backup-${jstStamp()}.json`;
      await uploadJson(backupName, snapshot);

      // current.json は統合済み最新版として上書き。
      await uploadJson('current.json', snapshot, currentFile?.id || '');"""
s=replace_once(s,old,new,'drive safe merge')
# helper for rollback snapshot
needle="  async function syncNow() {"
s=s.replace(needle,"  function storageApiSnapshot() {\n    try { return window.TaxiPayStorageSafety?.getPrimaryRaw?.() ?? null; } catch { return null; }\n  }\n\n"+needle,1)
write(p,s)

# --- app-meta: bump build, keep v1.4β ---
p='app-meta.js'; s=read(p)
s=s.replace("build: '20260826-18'","build: '20260827-01'").replace("cacheVersion: 'taxi-pay-v1.4-beta-20260826-18-clean-runtime'","cacheVersion: 'taxi-pay-v1.4-beta-20260827-01-data-safety'").replace("releasedAtJst: '2026/08/26 23:30:00 JST'","releasedAtJst: '2026/08/27 21:30:00 JST'")
write(p,s)

# --- Current-version spec consolidation. Git history remains the archival source. ---
current_spec=ROOT/'SPEC_v1.4beta.md'
parts=['# タクシー給与シミュレーター 仕様書 Version 1.4β\n','> このファイルを現行仕様の正本とする。旧版仕様はGit履歴で参照する。\n']
for name in ['SPEC_v1.md','SYSTEM_SPEC_v1.md','UI_DESIGN_SPEC_v1.md','DATABASE_DESIGN_v1.md','PAYROLL_CALC_SPEC_v1.md','SIMPLE_SPEC_BETA.md']:
    f=ROOT/name
    if f.exists(): parts.append(f'\n---\n\n## 旧仕様からの継承: {name}\n\n'+f.read_text(encoding='utf-8'))
parts.append('''\n---\n\n## Version 1.4β 2026-08-27 追記：データ保全・端末識別・復旧\n\n- 人間の操作ミスを前提とし、誤選択・キャンセル・途中離脱・やり直し・復元経路を設計する。\n- 端末名は物理端末ごとに1つ、同一ユーザー内で重複禁止。端末IDは内部識別子として維持する。\n- ブラウザはユーザーが自由に利用し、作成・更新ブラウザをデータ由来情報として記録する。\n- 既存テスターは端末名未設定時に1〜2秒の案内のみ。通常利用は妨げない。Google Driveの保存・同期・復元は端末名設定必須。\n- 新規利用者は初回利用端末の端末名設定を必須とする。ブラウザデータ消去・端末交換時は、サーバーに残るユーザーIDと登録端末IDから本人が引継先を選択できる。\n- 競合は更新日時だけで自動決定しない。差異だけを一覧表示し、選択した行を大きな比較画面で確認してユーザーが採用側を決定する。必要に応じて項目単位選択を可能とする。\n- 不採用データは完全削除せず退避する。有効データ → 退避データ → ユーザーによる完全削除の3段階とする。\n- 退避データ件数を表示し、ユーザーが選択して完全削除できる。完全削除後は退避ID・対象日・削除日時・操作端末だけを監査記録として残し、給与内容は保持しない。\n- 一方の端末で削除済み、他方にデータありの場合も競合とし、ユーザーが判断する。削除状態を採用しても残存データはまず退避する。\n- Google Driveバックアップは有効データだけでなく退避データ・競合履歴・削除記録を含める。世代バックアップを維持する。\n- 旧バックアップに新フィールドが無い場合は0件として読み込み、新アプリで後方互換を維持する。新形式を理解できない旧アプリからの復元は安全のため停止する。\n- Google Driveとは独立して、端末JSONから比較・競合解決・退避・ロールバックを行う「過去データ復旧」を標準装備する。\n- DEVELOPとPRODUCTIONの通常保存キーは分離し、開発版が本番キーを自動読み込みしない原則を維持する。\n- コード変更後は関連保存経路・旧キー・移行・同期・復元・端末差・起動経路を網羅確認し、回帰試験合格前に完成版として引き渡さない。\n''')
write('SPEC_v1.4beta.md',''.join(parts))
# Remove only the source spec files that were consolidated. Do not delete legal/setup/manual docs.
if APPLY:
    for name in ['SPEC_v1.md','SYSTEM_SPEC_v1.md','UI_DESIGN_SPEC_v1.md','DATABASE_DESIGN_v1.md','PAYROLL_CALC_SPEC_v1.md','SIMPLE_SPEC_BETA.md']:
        f=ROOT/name
        if f.exists(): f.unlink()

# Consolidate micro implementation notes into one current-version development history, preserving text before deleting files.
impl_files=sorted([p for p in ROOT.glob('IMPLEMENTATION_*.md') if p.name!='IMPLEMENTATION_HISTORY_v1.4beta.md'])
if impl_files:
    hist=['# 実装履歴 Version 1.4β\n','> 個別実装メモをこのファイルへ集約する。旧ファイルの履歴はGitでも参照可能。\n']
    for f in impl_files: hist.append(f'\n---\n\n## {f.name}\n\n'+f.read_text(encoding='utf-8'))
    hist.append('\n---\n\n## 2026-08-27 データ保全・復旧・端末識別\n\n- data-integrity-v14.js: 保存前の由来情報付与、削除検出、退避、tombstone、競合計画・解決。\n- data-recovery-v14.js: Google Drive非依存の標準復旧UI、差異一覧・詳細選択、バックアップ、退避管理。\n- device-registry-v14.js: 端末名の一意登録、既存端末ID引継ぎ、ブラウザ追跡、Drive利用条件。\n- phase56-drive-backup.js: current.json上書き前の比較・競合解決と統合済みスナップショット保存。\n- UI: バックアップ見出し修正、給与月ナビを勤務実績上部へ移動、iOSカスタム数字キーのdouble-tap zoom抑止。\n')
    write('IMPLEMENTATION_HISTORY_v1.4beta.md',''.join(hist))
    if APPLY:
        for f in impl_files:f.unlink()

print('v14 upgrade patch prepared/applied:', 'APPLY' if APPLY else 'DRY-RUN')
