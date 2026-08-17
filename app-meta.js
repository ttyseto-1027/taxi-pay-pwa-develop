(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260817-01',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260817-01-phase75-app-name',
    releasedAtJst: '2026/08/17 20:20 JST'
  });
})();
