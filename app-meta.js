(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260819-07',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260819-07-profile-diagnostics',
    releasedAtJst: '2026/08/19 12:52:36 JST'
  });
})();
