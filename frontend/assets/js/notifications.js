/**
 * FINDLY — notifications helper.
 * Loads the unread badge into the navbar and renders the notifications page.
 */
window.Notifications = (function () {
  async function loadAll() {
    return await API.get("/api/notifications");
  }

  async function refreshBadge() {
    try {
      var data = await loadAll();
      var badge = document.getElementById("notifBadge");
      if (badge) {
        badge.textContent = data.unread || "";
        badge.style.display = data.unread ? "inline" : "none";
      }
      var list = document.getElementById("notifDropList");
      if (list) {
        if (!data.notifications.length) {
          list.innerHTML = '<div class="px-3 py-3 small text-muted">No notifications yet</div>';
        } else {
          list.innerHTML = data.notifications
            .slice(0, 6)
            .map(function (n) {
              return (
                '<a class="fin-notif-item' + (Number(n.isRead) ? "" : " unread") + '" href="' +
                (n.itemId ? "item-details.html?id=" + n.itemId : "notifications.html") + '">' +
                "<div>" + Auth.escapeHtml(n.message) + "</div>" +
                '<div class="small text-muted mt-1">' + window.formatDateTime(n.createdAt) + "</div></a>"
              );
            })
            .join("");
          if (!data.notifications.every(function (n) { return Number(n.isRead); })) {
            list.insertAdjacentHTML(
              "beforeend",
              '<div class="px-3 py-2 border-top"><a href="#" id="markAllRead" class="small">Mark all as read</a></div>'
            );
            var mk = document.getElementById("markAllRead");
            if (mk) {
              mk.addEventListener("click", async function (e) {
                e.preventDefault();
                var ids = data.notifications.filter(function (n) { return !Number(n.isRead); }).map(function (n) { return n.notificationId; });
                for (var i = 0; i < ids.length; i++) { try { await API.put("/api/notifications/" + ids[i] + "/read"); } catch (_) {} }
                refreshBadge();
              });
            }
          }
        }
      }
    } catch (_) {}
  }

  async function markRead(id) {
    await API.put("/api/notifications/" + id + "/read");
  }

  return {
    loadAll: loadAll,
    refreshBadge: refreshBadge,
    markRead: markRead,
  };
})();