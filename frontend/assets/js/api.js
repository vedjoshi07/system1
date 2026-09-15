/**
 * FINDLY — API client with Automatic Live Cloud Fallback.
 * When a live PHP+MySQL backend is reachable, it uses native fetch().
 * When offline or on Netlify before backend deployment, it seamlessly
 * activates the In-Browser Engine with standard backend envelope structures.
 */
window.API = (function () {
  // ============================================================
  // IN-BROWSER SIMULATION ENGINE (Seed data + LocalStorage DB)
  // ============================================================
  var DB_KEY = 'findly_cloud_db_v4';
  var SESSION_KEY = 'findly_cloud_session_v4';

  function getDB() {
    var raw = localStorage.getItem(DB_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (_) {}
    }
    // Initial Seed Database
    var seed = {
      users: [
        { userId: 1, name: 'Rohit Desai', email: 'admin@gnu.ac.in', role: 'ADMIN', contactNo: '9876543210', enrollmentNo: 'ADM0001', accountStatus: 'ACTIVE' },
        { userId: 2, name: 'Priya Shah', email: 'staff@gnu.ac.in', role: 'STAFF', contactNo: '9825012345', enrollmentNo: 'EMP1023', accountStatus: 'ACTIVE' },
        { userId: 3, name: 'Meet Patel', email: 'meet.patel@gnu.ac.in', role: 'STUDENT', contactNo: '9099045678', enrollmentNo: '20BECE1001', accountStatus: 'ACTIVE' },
        { userId: 4, name: 'Sneha Joshi', email: 'sneha.joshi@gnu.ac.in', role: 'STUDENT', contactNo: '9725567890', enrollmentNo: '21BECE2034', accountStatus: 'ACTIVE' },
        { userId: 5, name: 'Ved Joshi', email: '24012011035@gnu.ac.in', role: 'STUDENT', contactNo: '9876543210', enrollmentNo: '24012011035', accountStatus: 'ACTIVE' }
      ],
      categories: [
        { categoryId: 1, categoryName: 'Electronics' },
        { categoryId: 2, categoryName: 'Documents/ID Cards' },
        { categoryId: 3, categoryName: 'Bags' },
        { categoryId: 4, categoryName: 'Accessories' },
        { categoryId: 5, categoryName: 'Books/Stationery' },
        { categoryId: 6, categoryName: 'Others' }
      ],
      items: [
        {
          itemId: 1,
          title: 'Black Lenovo Laptop Charger',
          description: 'Black Lenovo laptop charger (65W) left plugged in Computer Lab 302. Has a small sticker on the block with "M9" written on it.',
          itemType: 'LOST',
          categoryId: 1,
          categoryName: 'Electronics',
          location: 'Computer Lab 302, U & P Umar Institute',
          itemDate: '2026-08-18',
          imageUrl: null,
          custodyLocation: null,
          custodyStatus: null,
          status: 'PENDING',
          postedBy: 3,
          loggedByStaff: null,
          recipientName: null,
          recipientContactNo: null,
          recipientEnrollmentNo: null,
          createdAt: '2026-08-18 10:15:00'
        },
        {
          itemId: 2,
          title: 'Blue College ID Card',
          description: 'Lost my blue student ID card with name Sneha Joshi (21BECE2034). Last seen at the main library reading hall.',
          itemType: 'LOST',
          categoryId: 2,
          categoryName: 'Documents/ID Cards',
          location: 'Main Library, Reading Hall',
          itemDate: '2026-08-15',
          imageUrl: null,
          custodyLocation: null,
          custodyStatus: null,
          status: 'ACTIVE',
          postedBy: 4,
          loggedByStaff: null,
          recipientName: null,
          recipientContactNo: null,
          recipientEnrollmentNo: null,
          createdAt: '2026-08-15 14:20:00'
        },
        {
          itemId: 3,
          title: 'Samsung Galaxy Watch',
          description: 'Samsung Galaxy Watch (black, 44mm) found on a bench near the central canteen. Screen has a small crack at the top edge.',
          itemType: 'FOUND',
          categoryId: 1,
          categoryName: 'Electronics',
          location: 'Central Canteen, open area near Juice Corner',
          itemDate: '2026-08-17',
          imageUrl: null,
          custodyLocation: 'Campus Security Office, Block A',
          custodyStatus: 'IN_CUSTODY',
          status: 'PENDING',
          postedBy: 2,
          loggedByStaff: 2,
          recipientName: null,
          recipientContactNo: null,
          recipientEnrollmentNo: null,
          createdAt: '2026-08-17 09:05:00'
        },
        {
          itemId: 4,
          title: 'Grey Laptop Bag with Notebooks',
          description: 'Grey backpack containing a green notebook, a pen pouch and an engineering drawing booklet, found in MCA Block corridor.',
          itemType: 'FOUND',
          categoryId: 3,
          categoryName: 'Bags',
          location: 'MCA Block, first floor corridor',
          itemDate: '2026-08-12',
          imageUrl: null,
          custodyLocation: 'Campus Security Office, Block A',
          custodyStatus: 'IN_CUSTODY',
          status: 'ACTIVE',
          postedBy: 2,
          loggedByStaff: 2,
          recipientName: null,
          recipientContactNo: null,
          recipientEnrollmentNo: null,
          createdAt: '2026-08-12 10:20:00'
        },
        {
          itemId: 5,
          title: 'Karbonn Power Bank',
          description: 'White Karbonn 10000 mAh power bank handed in by a student. Found near Seminar Hall 1 during placement drive.',
          itemType: 'FOUND',
          categoryId: 1,
          categoryName: 'Electronics',
          location: 'Seminar Hall 1, IT Block',
          itemDate: '2026-08-05',
          imageUrl: null,
          custodyLocation: 'Campus Security Office, Block A',
          custodyStatus: 'HANDED_OVER',
          status: 'RESOLVED',
          postedBy: 2,
          loggedByStaff: 2,
          recipientName: 'Karan Mehta',
          recipientContactNo: '9099911223',
          recipientEnrollmentNo: '20BECE3045',
          claimedAt: '2026-08-06 11:30:00',
          resolvedAt: '2026-08-06 11:45:00',
          createdAt: '2026-08-05 13:45:00'
        }
      ],
      notifications: [
        { notificationId: 1, userId: 5, itemId: null, message: 'Welcome to FINDLY! You can report lost items or browse found campus items anytime.', isRead: false, createdAt: '2026-08-20 09:00:00' },
        { notificationId: 2, userId: 5, itemId: 2, message: 'A new found item "Blue College ID Card" matching your department was turned in.', isRead: false, createdAt: '2026-08-16 11:00:00' },
        { notificationId: 3, userId: 3, itemId: 1, message: 'Your lost item report "Black Lenovo Laptop Charger" is active and visible.', isRead: false, createdAt: '2026-08-18 10:15:00' },
        { notificationId: 4, userId: 4, itemId: 2, message: 'Your lost item report "Blue College ID Card" has been approved.', isRead: true, createdAt: '2026-08-15 16:00:00' },
        { notificationId: 5, userId: 2, itemId: 4, message: 'Found item "Grey Laptop Bag with Notebooks" has been approved for custody.', isRead: true, createdAt: '2026-08-12 14:10:00' },
        { notificationId: 6, userId: 2, itemId: 5, message: 'Item "Karbonn Power Bank" was marked as resolved. Handover completed.', isRead: true, createdAt: '2026-08-06 11:45:00' },
        { notificationId: 7, userId: 1, itemId: 3, message: 'New found item "Samsung Galaxy Watch" is awaiting moderation.', isRead: false, createdAt: '2026-08-17 09:05:00' }
      ],
      auditLogs: [
        { auditId: 1, userId: 2, itemId: 3, action: 'POST', oldStatus: null, newStatus: 'PENDING', details: 'Found item logged: Samsung Galaxy Watch', timestamp: '2026-08-17 09:05:00' },
        { auditId: 2, userId: 1, itemId: 2, action: 'MODERATE', oldStatus: 'PENDING', newStatus: 'ACTIVE', details: 'Approved lost item: Blue College ID Card', timestamp: '2026-08-15 16:00:00' },
        { auditId: 3, userId: 2, itemId: 5, action: 'RESOLVE', oldStatus: 'CLAIMED', newStatus: 'RESOLVED', details: 'Item marked resolved; handed over to recipient', timestamp: '2026-08-06 11:45:00' }
      ]
    };
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  }

  function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  function getCurrentSession() {
    var raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (_) { return null; }
  }

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  // Handle in-browser simulated API request
  function handleMock(method, path, body) {
    var db = getDB();
    var session = getCurrentSession();
    var parts = path.split('?');
    var pathname = parts[0];
    var queryString = parts[1] || '';
    var params = {};
    if (queryString) {
      queryString.split('&').forEach(function (pair) {
        var kv = pair.split('=');
        if (kv[0]) params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
      });
    }

    // Helper to get category name by ID
    function getCatName(cid) {
      for (var k = 0; k < db.categories.length; k++) {
        if (db.categories[k].categoryId === parseInt(cid, 10)) {
          return db.categories[k].categoryName;
        }
      }
      return 'General';
    }

    // Helper to get item title by ID
    function getItemTitle(itemId) {
      if (!itemId) return null;
      for (var i = 0; i < db.items.length; i++) {
        if (db.items[i].itemId === parseInt(itemId, 10)) {
          return db.items[i].title;
        }
      }
      return null;
    }

    // ── Auth Routes ──────────────────────────────────────────
    if (pathname === '/api/auth/me') {
      if (!session) {
        var err = new Error('Unauthorized');
        err.status = 401;
        throw err;
      }
      return session;
    }

    if (pathname === '/api/auth/login') {
      var email = (body && body.email ? body.email.trim().toLowerCase() : '');
      var found = null;
      for (var i = 0; i < db.users.length; i++) {
        if (db.users[i].email.toLowerCase() === email) {
          found = db.users[i];
          break;
        }
      }

      // If user exists in DB, log them in
      if (!found) {
        // Auto-register any valid student institutional email
        var match = email.match(/^([a-zA-Z0-9._]+)@(gnu\.ac\.in|ganpatuniversity\.ac\.in)$/i);
        if (match) {
          found = {
            userId: db.users.length + 1,
            name: match[1].charAt(0).toUpperCase() + match[1].slice(1),
            email: email,
            role: 'STUDENT',
            contactNo: '9876543210',
            enrollmentNo: match[1].toUpperCase(),
            accountStatus: 'ACTIVE'
          };
          db.users.push(found);

          // Add welcome notification for the new user
          db.notifications.unshift({
            notificationId: db.notifications.length + 1,
            userId: found.userId,
            itemId: null,
            message: 'Welcome to FINDLY! You can report lost items or browse found campus items anytime.',
            isRead: false,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
          });

          saveDB(db);
        } else {
          var err = new Error('Invalid email or password');
          err.status = 401;
          throw err;
        }
      }
      setSession(found);
      return found;
    }

    if (pathname === '/api/auth/register') {
      var newUser = {
        userId: db.users.length + 1,
        name: body.name || 'Student',
        email: body.email.toLowerCase(),
        role: 'STUDENT',
        contactNo: body.contactNo || '',
        enrollmentNo: body.enrollmentNo || '',
        accountStatus: 'ACTIVE'
      };
      db.users.push(newUser);

      db.notifications.unshift({
        notificationId: db.notifications.length + 1,
        userId: newUser.userId,
        itemId: null,
        message: 'Welcome to FINDLY! Your student account has been registered successfully.',
        isRead: false,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
      });

      saveDB(db);
      setSession(newUser);
      return newUser;
    }

    if (pathname === '/api/auth/logout') {
      clearSession();
      return { message: 'Logged out' };
    }

    if (pathname === '/api/profile') {
      if (session) {
        if (body.name) session.name = body.name;
        if (body.contactNo) session.contactNo = body.contactNo;
        setSession(session);
        for (var u = 0; u < db.users.length; u++) {
          if (db.users[u].userId === session.userId) {
            db.users[u].name = session.name;
            db.users[u].contactNo = session.contactNo;
            break;
          }
        }
        saveDB(db);
      }
      return session;
    }

    // ── Categories ───────────────────────────────────────────
    if (pathname === '/api/categories') {
      if (method === 'GET') {
        return { categories: db.categories };
      }
      if (method === 'POST') {
        var newCat = { categoryId: db.categories.length + 1, categoryName: body.categoryName };
        db.categories.push(newCat);
        saveDB(db);
        return { categoryId: newCat.categoryId, category: newCat };
      }
    }
    if (pathname.match(/^\/api\/categories\/(\d+)$/)) {
      var catId = parseInt(RegExp.$1, 10);
      if (method === 'PUT') {
        for (var c = 0; c < db.categories.length; c++) {
          if (db.categories[c].categoryId === catId) {
            db.categories[c].categoryName = body.categoryName;
            saveDB(db);
            return { categoryId: catId, category: db.categories[c] };
          }
        }
      }
      if (method === 'DELETE') {
        db.categories = db.categories.filter(function (x) { return x.categoryId !== catId; });
        saveDB(db);
        return { message: 'Category deleted' };
      }
    }

    // ── Items ────────────────────────────────────────────────
    if (pathname === '/api/items' && method === 'GET') {
      var result = db.items.slice();
      if (params.type) {
        result = result.filter(function (it) { return it.itemType === params.type; });
      }
      if (params.status) {
        result = result.filter(function (it) { return it.status === params.status; });
      }
      if (params.category || params.categoryId) {
        var targetCat = params.category || params.categoryId;
        result = result.filter(function (it) { return String(it.categoryId) === String(targetCat); });
      }
      if (params.q || params.search) {
        var q = (params.q || params.search).toLowerCase();
        result = result.filter(function (it) {
          return (it.title || '').toLowerCase().indexOf(q) !== -1 ||
                 (it.description || '').toLowerCase().indexOf(q) !== -1 ||
                 (it.location || '').toLowerCase().indexOf(q) !== -1;
        });
      }
      result.sort(function (a, b) { return b.itemId - a.itemId; });
      return { items: result, count: result.length };
    }

    // Single item
    var itemMatch = pathname.match(/^\/api\/items\/(\d+)$/);
    if (itemMatch) {
      var itId = parseInt(itemMatch[1], 10);
      var itemObj = null;
      for (var idx = 0; idx < db.items.length; idx++) {
        if (db.items[idx].itemId === itId) {
          itemObj = db.items[idx];
          break;
        }
      }
      if (method === 'GET') {
        if (!itemObj) { var e = new Error('Item not found'); e.status = 404; throw e; }
        return { item: itemObj };
      }
      if (method === 'DELETE') {
        db.items = db.items.filter(function (x) { return x.itemId !== itId; });
        saveDB(db);
        return { message: 'Item deleted' };
      }
      if (method === 'PUT') {
        if (itemObj) {
          Object.assign(itemObj, body);
          saveDB(db);
        }
        return { item: itemObj };
      }
    }

    // Item creation (lost or found)
    if (pathname === '/api/items' || pathname === '/api/items/lost' || pathname === '/api/items/found') {
      var isLost = (pathname === '/api/items/lost' || (body && (body.itemType === 'LOST' || (body.get && body.get('itemType') === 'LOST'))));
      var currentUserId = session ? session.userId : 5;
      var role = session ? session.role : 'STUDENT';
      var catIdVal = parseInt((body && body.get ? body.get('categoryId') : (body ? body.categoryId : 1)) || 1, 10);

      var createdItem = {
        itemId: db.items.length + 1,
        title: (body && body.get ? body.get('title') : (body ? body.title : '')) || 'Untitled Item',
        description: (body && body.get ? body.get('description') : (body ? body.description : '')) || '',
        itemType: isLost ? 'LOST' : 'FOUND',
        categoryId: catIdVal,
        categoryName: getCatName(catIdVal),
        location: (body && body.get ? body.get('location') : (body ? body.location : '')) || 'Campus',
        itemDate: (body && body.get ? body.get('itemDate') : (body ? body.itemDate : '')) || new Date().toISOString().slice(0, 10),
        imageUrl: null,
        custodyLocation: (!isLost && (body && body.get ? body.get('custodyLocation') : (body ? body.custodyLocation : ''))) || (isLost ? null : 'Security Desk'),
        custodyStatus: isLost ? null : 'IN_CUSTODY',
        status: 'ACTIVE',
        postedBy: currentUserId,
        loggedByStaff: role === 'STAFF' ? currentUserId : null,
        recipientName: null,
        recipientContactNo: null,
        recipientEnrollmentNo: null,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      db.items.unshift(createdItem);

      // Instant notification for the item submitter
      var notifMsg = isLost
        ? 'Your lost report for "' + createdItem.title + '" is now active on campus portal.'
        : 'Found item "' + createdItem.title + '" was logged into campus inventory.';

      db.notifications.unshift({
        notificationId: db.notifications.length + 1,
        userId: currentUserId,
        itemId: createdItem.itemId,
        message: notifMsg,
        isRead: false,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
      });

      saveDB(db);
      return { itemId: createdItem.itemId, item: createdItem };
    }

    // Item actions
    if (pathname.match(/^\/api\/items\/(\d+)\/moderate$/)) {
      var mid = parseInt(RegExp.$1, 10);
      for (var m = 0; m < db.items.length; m++) {
        if (db.items[m].itemId === mid) {
          var decision = (body.decision === 'APPROVE' ? 'ACTIVE' : 'REJECTED');
          db.items[m].status = decision;
          var verb = decision === 'ACTIVE' ? 'approved and is now live' : 'rejected';
          db.notifications.unshift({
            notificationId: db.notifications.length + 1,
            userId: db.items[m].postedBy,
            itemId: mid,
            message: 'Your item report "' + db.items[m].title + '" has been ' + verb + '.',
            isRead: false,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
          });
          saveDB(db);
          return { itemId: mid, newStatus: db.items[m].status };
        }
      }
    }
    if (pathname.match(/^\/api\/items\/(\d+)\/claim$/)) {
      var cid = parseInt(RegExp.$1, 10);
      for (var cl = 0; cl < db.items.length; cl++) {
        if (db.items[cl].itemId === cid) {
          db.items[cl].status = 'CLAIMED';
          db.items[cl].claimedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

          db.notifications.unshift({
            notificationId: db.notifications.length + 1,
            userId: db.items[cl].postedBy,
            itemId: cid,
            message: 'Your item "' + db.items[cl].title + '" has been claimed for verification.',
            isRead: false,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
          });

          saveDB(db);
          return { itemId: cid, status: 'CLAIMED' };
        }
      }
    }
    if (pathname.match(/^\/api\/items\/(\d+)\/resolve$/)) {
      var rid = parseInt(RegExp.$1, 10);
      for (var r = 0; r < db.items.length; r++) {
        if (db.items[r].itemId === rid) {
          db.items[r].status = 'RESOLVED';
          db.items[r].custodyStatus = 'HANDED_OVER';
          db.items[r].resolvedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

          db.notifications.unshift({
            notificationId: db.notifications.length + 1,
            userId: db.items[r].postedBy,
            itemId: rid,
            message: 'Handover complete! Item "' + db.items[r].title + '" has been resolved.',
            isRead: false,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
          });

          saveDB(db);
          return { itemId: rid, status: 'RESOLVED' };
        }
      }
    }
    if (pathname.match(/^\/api\/items\/(\d+)\/custody$/)) {
      var cstid = parseInt(RegExp.$1, 10);
      for (var cs = 0; cs < db.items.length; cs++) {
        if (db.items[cs].itemId === cstid) {
          if (body.custodyLocation) db.items[cs].custodyLocation = body.custodyLocation;
          if (body.custodyStatus) db.items[cs].custodyStatus = body.custodyStatus;
          saveDB(db);
          return { itemId: cstid, item: db.items[cs] };
        }
      }
    }
    if (pathname.match(/^\/api\/items\/(\d+)\/recipient$/)) {
      var rcpid = parseInt(RegExp.$1, 10);
      for (var rp = 0; rp < db.items.length; rp++) {
        if (db.items[rp].itemId === rcpid) {
          db.items[rp].recipientName = body.recipientName;
          db.items[rp].recipientContactNo = body.recipientContactNo;
          db.items[rp].recipientEnrollmentNo = body.recipientEnrollmentNo;
          saveDB(db);
          return { itemId: rcpid, item: db.items[rp] };
        }
      }
    }

    // ── Dashboards ───────────────────────────────────────────
    if (pathname === '/api/dashboard/student') {
      var myId = session ? session.userId : 5;
      var myItems = db.items.filter(function (x) { return x.postedBy === myId && x.itemType === 'LOST'; });
      var myPending = myItems.filter(function (x) { return x.status === 'PENDING'; }).length;
      var myActive = myItems.filter(function (x) { return x.status === 'ACTIVE'; }).length;
      var myRejected = myItems.filter(function (x) { return x.status === 'REJECTED'; }).length;
      var activeFound = db.items.filter(function (x) { return x.itemType === 'FOUND' && x.status === 'ACTIVE'; }).length;
      return {
        myLostByStatus: { PENDING: myPending, ACTIVE: myActive, REJECTED: myRejected },
        totalLostReports: myItems.length,
        activeFoundItems: activeFound
      };
    }

    if (pathname === '/api/dashboard/staff') {
      var pendingFound = db.items.filter(function (x) { return x.itemType === 'FOUND' && x.status === 'PENDING'; }).length;
      var activeFoundStaff = db.items.filter(function (x) { return x.itemType === 'FOUND' && x.status === 'ACTIVE'; }).length;
      var inCustodyStaff = db.items.filter(function (x) { return x.custodyStatus === 'IN_CUSTODY'; }).length;
      var resolvedStaff = db.items.filter(function (x) { return x.status === 'RESOLVED'; }).length;
      return {
        pendingFoundLogs: pendingFound,
        activeFoundItems: activeFoundStaff,
        itemsInCustody: inCustodyStaff,
        resolvedThisWeek: resolvedStaff
      };
    }

    if (pathname === '/api/dashboard/admin') {
      var totalUsers = db.users.length;
      var pendingApprovals = db.items.filter(function (x) { return x.status === 'PENDING'; }).length;
      var pendingHandovers = db.items.filter(function (x) { return x.status === 'CLAIMED'; }).length;
      var resolvedCount = db.items.filter(function (x) { return x.status === 'RESOLVED'; }).length;
      var activeItemsCount = db.items.filter(function (x) { return x.status === 'ACTIVE'; }).length;
      return {
        totalUsers: totalUsers,
        pendingApprovals: pendingApprovals,
        pendingHandovers: pendingHandovers,
        resolvedCount: resolvedCount,
        resolvedThisWeek: resolvedCount,
        activeItems: activeItemsCount,
        recentActivity: db.auditLogs || []
      };
    }

    // ── Users ────────────────────────────────────────────────
    if (pathname === '/api/users') {
      return { users: db.users };
    }
    if (pathname.match(/^\/api\/users\/(\d+)\/status$/)) {
      var uid = parseInt(RegExp.$1, 10);
      for (var u1 = 0; u1 < db.users.length; u1++) {
        if (db.users[u1].userId === uid) {
          db.users[u1].accountStatus = body.status;
          saveDB(db);
          return { userId: uid, status: body.status };
        }
      }
    }

    // ── Notifications ────────────────────────────────────────
    if (pathname === '/api/notifications') {
      var userMyId = session ? session.userId : 5;
      var userNotes = db.notifications.filter(function (n) { return n.userId === userMyId; });

      // Add itemTitle to notifications
      userNotes.forEach(function (n) {
        if (!n.itemTitle && n.itemId) {
          n.itemTitle = getItemTitle(n.itemId);
        }
      });

      var unreadCount = userNotes.filter(function (n) { return !n.isRead || n.isRead === "0" || n.isRead === 0; }).length;
      return { notifications: userNotes, unread: unreadCount };
    }

    if (pathname.match(/^\/api\/notifications\/(\d+)\/read$/)) {
      var nid = parseInt(RegExp.$1, 10);
      for (var no = 0; no < db.notifications.length; no++) {
        if (db.notifications[no].notificationId === nid) {
          db.notifications[no].isRead = true;
          saveDB(db);
          return { message: 'Notification marked as read' };
        }
      }
      return { message: 'OK' };
    }

    // Default fallback
    return { message: 'Success', success: true };
  }

  // ============================================================
  // MAIN REQUEST ROUTER
  // ============================================================
  async function request(method, path, body, isForm) {
    var isLivePlaceholder = (window.API_BASE_URL && window.API_BASE_URL.indexOf('YOUR-BACKEND') !== -1);

    // If on Netlify and backend URL is placeholder, use In-Browser Engine directly
    if (isLivePlaceholder) {
      try {
        return handleMock(method, path, body);
      } catch (mockErr) {
        if (mockErr.status === 401) {
          var pathname = location.pathname;
          if (!pathname.endsWith("login.html") && !pathname.endsWith("register.html")) {
            var redirect = encodeURIComponent(pathname + location.search);
            location.href = (window.BASE || "") + "login.html?redirect=" + redirect;
          }
        }
        throw mockErr;
      }
    }

    // Try real fetch first
    var opts = { method: method, credentials: "include", headers: {} };
    if (body !== undefined && body !== null) {
      if (isForm) {
        opts.body = body;
      } else {
        opts.headers["Content-Type"] = "application/json";
        opts.body = JSON.stringify(body);
      }
    }

    var res;
    try {
      res = await fetch(window.API_BASE_URL + path, opts);
    } catch (networkErr) {
      // Network failure / server unreachable -> seamlessly fallback to In-Browser Engine!
      console.warn("FINDLY: Server unreachable at " + window.API_BASE_URL + ". Falling back to interactive browser engine.");
      return handleMock(method, path, body);
    }

    var payload = null;
    try {
      payload = await res.json();
    } catch (_) {}

    if (res.status === 401) {
      var pathname = location.pathname;
      if (!pathname.endsWith("login.html") && !pathname.endsWith("register.html")) {
        var redirect = encodeURIComponent(pathname + location.search);
        location.href = (window.BASE || "") + "login.html?redirect=" + redirect;
      }
    }

    if (!res.ok) {
      var err = new Error((payload && payload.message) || "Request failed (HTTP " + res.status + ")");
      err.status = res.status;
      err.payload = payload || {};
      if (payload && payload.data && payload.data.errors) err.fieldErrors = payload.data.errors;
      throw err;
    }

    return payload ? payload.data : null;
  }

  return {
    get: function (path) { return request("GET", path); },
    post: function (path, body) { return request("POST", path, body); },
    put: function (path, body) { return request("PUT", path, body); },
    del: function (path) { return request("DELETE", path); },
    postForm: function (path, formData) { return request("POST", path, formData, true); },
    putForm: function (path, formData) { return request("PUT", path, formData, true); },
    uploadUrl: function (rel) {
      if (!rel) return "";
      if (rel.indexOf('http') === 0 || rel.indexOf('data:') === 0) return rel;
      return (window.API_UPLOADS_URL || "") + "/" + rel;
    },
  };
})();