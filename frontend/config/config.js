/**
 * FINDLY frontend configuration.
 * Point API_BASE_URL at the backend public directory.
 * In the standard XAMPP setup the backend lives at:
 *   http://localhost/findly/backend/public
 */
(function () {
  // --- Default (XAMPP: frontend and backend share the Apache origin) ---
  window.API_BASE_URL = "http://localhost/findly/backend/public";
  window.API_UPLOADS_URL = "http://localhost/findly/backend/uploads";

  // --- Optional local dev via PHP built-in server ---
  //   frontend:  php -S 127.0.0.1:8080  (root = frontend/)
  //   backend:   php -S 127.0.0.1:8081 -t backend/public
  // If this page is being served from port 8080, talk to the local API instead.
  if (location.port === "8080") {
    window.API_BASE_URL = "http://127.0.0.1:8081";
    window.API_UPLOADS_URL = "http://127.0.0.1:8081/uploads";
  }

  window.API_BASE_PATH = "/api";

  // --- GitHub Pages static preview ---
  // Pages can only host static files (no PHP/MySQL), so flag demo mode:
  // pages still open, but API calls show a clear notice instead of failing.
  window.FINDLY_DEMO = /github\.io/i.test(location.hostname);
})();