(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20261113-01',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20261113-payroll-rules-01',
    releasedAtJst: '2026/11/13 00:30:54 JST'
  });
})();
