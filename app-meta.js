(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260819-04',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260819-04-system-info-sw-diagnostic',
    releasedAtJst: '2026/08/19 12:18:17 JST'
  });
})();
