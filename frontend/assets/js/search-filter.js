/**
 * FINDLY — shared search/filter helpers.
 * Builds a consistent query string from a search form (keyword, category,
 * date, location) used across Browse Found Items and Manage lists.
 */
window.SearchFilter = (function () {
  /**
   * Read inputs from a form into a params object, skipping empty values.
   * Supports [name], select[name], input[type=date].
   */
  function readForm(formEl) {
    var params = {};
    new FormData(formEl).forEach(function (value, key) {
      var v = String(value).trim();
      if (v !== "") {
        params[key] = v;
      }
    });
    return params;
  }

  /**
   * Turn a params object into a query string (without leading '?').
   */
  function toQueryString(params) {
    var parts = [];
    Object.keys(params).forEach(function (k) {
      parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k]));
    });
    return parts.join("&");
  }

  /**
   * Bind a submit handler that appends the filter query to a given base
   * path and calls back with the final full path + params.
   */
  function bind(formId, basePath, onResult) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var params = readForm(form);
      var qs = toQueryString(params);
      var target = basePath + (basePath.indexOf("?") === -1 ? "?" : "&") + qs;
      onResult(target, params);
    });
    var reset = form.querySelector("[type=reset]");
    if (reset) {
      reset.addEventListener("click", function () {
        setTimeout(function () {
          onResult(basePath, {});
        }, 60);
      });
    }
  }

  /** Populate a <select> with categories. */
  async function loadCategories(selectEl, includeAll) {
    if (!selectEl) return;
    var data = await API.get("/api/categories");
    selectEl.innerHTML =
      (includeAll ? '<option value="">All categories</option>' : '<option value="">Select category</option>') +
      data.categories
        .map(function (c) { return '<option value="' + c.categoryId + '">' + Auth.escapeHtml(c.categoryName) + "</option>"; })
        .join("");
  }

  return {
    readForm: readForm,
    toQueryString: toQueryString,
    bind: bind,
    loadCategories: loadCategories,
  };
})();