(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260824-11',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260824-11-phase4-phase7',
    releasedAtJst: '2026/08/24 21:25:52 JST'
  });
})();
