(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260819-06',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260819-06-system-info-auth-recovery',
    releasedAtJst: '2026/08/19 12:33:44 JST'
  });
})();
