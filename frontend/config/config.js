/**
 * FINDLY frontend configuration.
 * Point API_BASE_URL at the backend public directory.
 */
(function () {
  // ── Production (Netlify frontend + Railway backend) ──────────────────
  // Replace the URL below with your Railway backend URL after deploying.
  var PRODUCTION_API = 'https://YOUR-BACKEND.up.railway.app';

  // ── Local dev via PHP built-in server ────────────────────────────────
  //   frontend:  php -S 127.0.0.1:8080  (root = frontend/)
  //   backend:   php -S 127.0.0.1:8081 -t backend/public
  if (location.port === '8080' || location.port === '8081') {
    window.API_BASE_URL    = 'http://127.0.0.1:8081';
    window.API_UPLOADS_URL = 'http://127.0.0.1:8081/uploads';

  // ── XAMPP local ───────────────────────────────────────────────────────
  } else if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    window.API_BASE_URL    = 'http://localhost/findly/backend/public';
    window.API_UPLOADS_URL = 'http://localhost/findly/backend/uploads';

  // ── Live (Netlify) ────────────────────────────────────────────────────
  } else {
    window.API_BASE_URL    = PRODUCTION_API;
    window.API_UPLOADS_URL = PRODUCTION_API + '/uploads';
    // Remove demo flag — real backend is running.
    window.FINDLY_DEMO = false;
  }

  window.API_BASE_PATH = '/api';
})();