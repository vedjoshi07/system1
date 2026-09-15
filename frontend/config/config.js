/**
 * FINDLY frontend configuration.
 * Point API_BASE_URL at the backend public directory.
 */
(function () {
  // ── Production (Netlify frontend + Railway backend) ──────────────────
  // Replace the URL below with your Railway backend URL after deploying.
  var PRODUCTION_API = 'https://YOUR-BACKEND.up.railway.app';

  // ── Local dev (PHP built-in server on port 8081) ─────────────────────
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:') {
    window.API_BASE_URL    = 'http://127.0.0.1:8081';
    window.API_UPLOADS_URL = 'http://127.0.0.1:8081/uploads';

  // ── Live (Netlify) ────────────────────────────────────────────────────
  } else {
    window.API_BASE_URL    = PRODUCTION_API;
    window.API_UPLOADS_URL = PRODUCTION_API + '/uploads';
    // Remove demo flag — real backend is running.
    window.FINDLY_DEMO = false;
  }

  window.API_BASE_PATH = '/api';
})();