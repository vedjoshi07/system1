/**
 * FINDLY — notifications helper.
 * Loads the unread badge into the navbar and renders the notifications page.
 */
window.Notifications = (function () {
  async function loadAll() {
    try {
      var res = await API.get("/api/notifications");
      if (res && res.notifications) {
        return res;
      }
      if (Array.isArray(res)) {
        return { notifications: res, unread: res.filter(function (n) { return !n.isRead; }).length };
      }
      return { notifications: [], unread: 0 };
    } catch (e) {
      console.error("Notifications load error:", e);
      return { notifications: [], unread: 0 };
    }
  }

  async function refreshBadge() {
    try {
      var data = await loadAll();
      var notifs = data.notifications || [];
      var unread = data.unread != null ? data.unread : notifs.filter(function (n) { return !n.isRead; }).length;

      var badge = document.getElementById("notifBadge");
      if (badge) {
        badge.textContent = unread || "";
        badge.style.display = unread > 0 ? "inline-block" : "none";
      }

      var list = document.getElementById("notifDropList");
      if (list) {
        if (!notifs.length) {
          list.innerHTML = '<div class="px-3 py-3 small text-muted text-center"><i class="bi bi-bell-slash d-block fs-4 mb-1 text-secondary"></i>No notifications yet</div>';
        } else {
          list.innerHTML = notifs
            .slice(0, 6)
            .map(function (n) {
              var isUnread = !n.isRead || n.isRead === "0" || n.isRead === 0;
              var dateStr = window.formatDateTime ? window.formatDateTime(n.createdAt) : n.createdAt;
              var link = n.itemId ? "item-details.html?id=" + n.itemId : "notifications.html";
              return (
                '<a class="fin-notif-item' + (isUnread ? " unread" : "") + '" href="' + link + '">' +
                '<div class="fw-medium' + (isUnread ? " text-dark" : " text-secondary") + '">' + Auth.escapeHtml(n.message) + "</div>" +
                '<div class="small text-muted mt-1">' + (dateStr || "Just now") + "</div></a>"
              );
            })
            .join("");

          var hasUnread = notifs.some(function (n) { return !n.isRead || n.isRead === "0" || n.isRead === 0; });
          if (hasUnread) {
            list.insertAdjacentHTML(
              "beforeend",
              '<div class="px-3 py-2 border-top bg-light text-center"><a href="#" id="markAllRead" class="small fw-semibold text-primary text-decoration-none">Mark all as read</a></div>'
            );
            var mk = document.getElementById("markAllRead");
            if (mk) {
              mk.addEventListener("click", async function (e) {
                e.preventDefault();
                var unreadItems = notifs.filter(function (n) { return !n.isRead || n.isRead === "0" || n.isRead === 0; });
                for (var i = 0; i < unreadItems.length; i++) {
                  try { await API.put("/api/notifications/" + unreadItems[i].notificationId + "/read"); } catch (_) {}
                }
                refreshBadge();
                if (typeof window.showToast === "function") window.showToast("All notifications marked as read");
              });
            }
          }
        }
      }
    } catch (err) {
      console.error("refreshBadge error:", err);
    }
  }

  async function markRead(id) {
    var res = await API.put("/api/notifications/" + id + "/read");
    refreshBadge();
    return res;
  }

  return {
    loadAll: loadAll,
    refreshBadge: refreshBadge,
    markRead: markRead,
  };
})();