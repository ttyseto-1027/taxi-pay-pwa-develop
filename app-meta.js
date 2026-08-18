(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260818-02',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260818-02-revenue-adjustment',
    releasedAtJst: '2026/08/18 23:52:46 JST'
  });
})();
