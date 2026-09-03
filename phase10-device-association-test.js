(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  if (params.get('phase10DeviceTest') !== '1') return;

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

  const waitForRegistry = async () => {
    for (let i = 0; i < 80; i += 1) {
      const registry = window.TaxiPayDeviceRegistry;
      if (registry && typeof registry.list === 'function') return registry;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error('端末管理機能を読み込めませんでした。');
  };

  const openTestDialog = async () => {
    if (document.getElementById('phase10AssociationTestDialog')) return;
    const registry = await waitForRegistry();
    let devices = registry.list().filter((d) => d?.deviceName && d.active !== false);

    for (let i = 0; i < 20 && !devices.length; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      devices = registry.list().filter((d) => d?.deviceName && d.active !== false);
    }

    const dialog = document.createElement('dialog');
    dialog.className = 'modal';
    dialog.id = 'phase10AssociationTestDialog';
    dialog.innerHTML = `
      <form method="dialog">
        <h2>この端末を登録してください</h2>
        <p class="setup-notice"><strong>Phase 10 非破壊テスト</strong><br>この画面では端末ID・端末名・Firestore・給与データ・Driveデータを変更しません。</p>
        <p class="note">登録済み端末を引き継ぐ場合は、端末を選択してから「選択した端末を引き継ぐ（テスト）」を押してください。</p>
        <div id="phase10TestExisting">
          <h3>登録済み端末を引き継ぐ</h3>
          <div class="device-inherit-options">
            ${devices.map((d) => `
              <label class="device-inherit-option">
                <input type="radio" name="phase10TestDevice" value="${escapeHtml(d.id)}">
                <span><strong>${escapeHtml(d.deviceName)}</strong><small>${escapeHtml(d.os || '')} / ${escapeHtml(d.browser || '')}</small></span>
              </label>
            `).join('') || '<p class="phase2-message" data-kind="error">登録済み端末を取得できませんでした。</p>'}
          </div>
          <div class="actions"><button type="button" id="phase10TestInherit" ${devices.length ? 'disabled' : 'disabled'}>選択した端末を引き継ぐ（テスト）</button></div>
        </div>
        <hr>
        <label>新しい端末として登録（テスト）<input id="phase10TestNewName" maxlength="40" placeholder="例：iPhone / 自宅PC"></label>
        <div class="actions"><button type="button" id="phase10TestNew">新しい端末として登録（テスト）</button></div>
        <p id="phase10TestMessage" class="phase2-message" aria-live="polite"></p>
        <div class="actions"><button type="submit" class="ghost">テスト画面を閉じる</button></div>
      </form>`;
    document.body.appendChild(dialog);

    const inheritButton = document.getElementById('phase10TestInherit');
    const message = document.getElementById('phase10TestMessage');
    dialog.querySelectorAll('input[name="phase10TestDevice"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        inheritButton.disabled = !dialog.querySelector('input[name="phase10TestDevice"]:checked');
      });
    });
    inheritButton.addEventListener('click', () => {
      const selected = dialog.querySelector('input[name="phase10TestDevice"]:checked');
      const target = devices.find((d) => d.id === selected?.value);
      if (!target) {
        message.textContent = '引き継ぐ端末を選択してください。';
        message.dataset.kind = 'error';
        return;
      }
      message.textContent = `テスト成功：${target.deviceName} を選択しました。実データは変更していません。`;
      message.dataset.kind = 'success';
    });
    document.getElementById('phase10TestNew').addEventListener('click', () => {
      const name = document.getElementById('phase10TestNewName').value.trim();
      if (!name) {
        message.textContent = 'テスト用の端末名を入力してください。';
        message.dataset.kind = 'error';
        return;
      }
      message.textContent = `テスト成功：${name} を新規端末として入力しました。実データは変更していません。`;
      message.dataset.kind = 'success';
    });

    dialog.addEventListener('close', () => dialog.remove(), { once: true });
    dialog.showModal();
  };

  const start = () => openTestDialog().catch((error) => {
    console.warn('phase10 nondestructive association test failed', error);
    window.TaxiPayDiagnostics?.notify?.(`Phase 10テストを開始できませんでした：${error.message || error}`, 'error', 'PHASE10-ASSOCIATION-TEST-FAIL');
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
