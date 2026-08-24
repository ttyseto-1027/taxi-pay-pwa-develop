(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260824-13',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260824-13-phase8-period-tap-input',
    releasedAtJst: '2026/08/24 22:44:28 JST'
  });
})();
