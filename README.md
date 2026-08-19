# FINDLY — Campus Lost & Found Management System

A centralized, web-based, **role-based** Campus Lost & Found platform for an academic
institution. It replaces informal WhatsApp / notice-board lost-and-found handling
with a structured digital workflow.

- **Students** report items they **LOST** and browse/search **FOUND** items.
- **Staff** and **Admin** are the only roles that can log a **Found** item, manage its
  custody location, mark it **Claimed**, record the recipient's verification details
  in person, and mark it **Resolved**.
- **Admin** also moderates pending posts, manages categories and users, and views
  system-wide statistics.
- There is **no** student-facing claim-request workflow and **no** AI matching —
  ownership is verified in person at the security desk.

---

## Tech Stack

| Layer     | Technology                                             |
|-----------|--------------------------------------------------------|
| Frontend  | HTML5, CSS3, Bootstrap 5, vanilla JS + jQuery, `fetch` |
| Backend   | PHP 8+ (plain PHP, MVC-style, JSON API)                 |
| Database  | MySQL 8+                                                |
| Auth      | PHP sessions + bcrypt (`password_hash`/`password_verify`) |

No framework — every layer is easy to explain and defend in a viva.

## Folder structure

```
findly/
├── frontend/                  # Pure HTML/CSS/JS (no PHP)
│   ├── index.html             # Landing for guests
│   ├── login.html / register.html
│   ├── student/               # 7 student pages
│   ├── staff/                 # 6 staff pages
│   ├── admin/                 # 8 admin pages
│   ├── assets/                # css / js / img
│   └── config/config.js       # API base URL
├── backend/                   # JSON API only (no HTML)
│   ├── public/index.php       # Front controller + .htaccess router
│   ├── config/                # env.php (reads .env) + db.php (PDO)
│   ├── src/                   # Controllers, repositories, middleware, utils
│   ├── routes/api.php         # method+path -> controller action
│   ├── uploads/items/         # uploaded item photos
│   └── .env                   # DB credentials (copy from .env.example)
└── database/
    ├── schema.sql             # Exact CREATE TABLE script (source of truth)
    ├── seed.sql               # Categories, admin, staff, students, items
    ├── migrations/            # Optional incremental migrations
    └── ERD.md                 # Textual ER diagram + lifecycle
```

**Integration rule:** `frontend/` never touches MySQL. It only calls
`backend/public/index.php` JSON endpoints. `backend/` never renders HTML.
`database/` is the single source of truth — the backend assumes `schema.sql`
has already been imported; it never creates tables at runtime.

---

## Installation — XAMPP

### 1. Install XAMPP
Download and install **XAMPP** (PHP 8.x + Apache + MySQL) from apachefriends.org,
then start **Apache** and **MySQL** from the XAMPP Control Panel.

### 2. Database
1. Copy the whole `findly/` folder into the XAMPP web root:
   `C:\xampp\htdocs\` (Windows) or `~/Applications/XAMPP/htdocs/` (macOS XAMPP).
2. Import the schema and seed data with the MySQL client (or phpMyAdmin → Import):

   ```
   mysql -u root < database/schema.sql
   mysql -u root < database/seed.sql
   ```

   (Adjust credentials if your root user has a password.)
3. Verify: `mysql -u root -e "USE findly; SELECT COUNT(*) FROM user;"` → `6` users once seeds are in.

### 3. Backend config
```
cd backend
cp .env.example .env
```
Edit `backend/.env` to match your MySQL credentials:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=findly
DB_USER=root
DB_PASS=
```

### 4. Permissions
Make sure the PHP process can write to `backend/uploads/items/`
(chmod 775 / give IIS/Apache write access as needed) so item photos upload correctly.

### 5. Open the app
Frontend and backend share the same Apache origin, so:

**`http://localhost/findly/frontend/`**

The backend JSON API is at `http://localhost/findly/backend/public/api/...`
(served through `public/.htaccess` → `index.php`).

---

## Optional — PHP built-in server (no Apache needed)

```bash
# Terminal 1 — backend API on :8081
cd findly/backend
php -S 127.0.0.1:8081 -t public

# Terminal 2 — frontend on :8080
cd findly/frontend
php -S 127.0.0.1:8080
```

Open **http://127.0.0.1:8080**. `frontend/config/config.js` automatically points at
`:8081` when it sees port 8080. CORS is pre-configured in `backend/.env`.

---

## Demo / sample accounts (from `seed.sql`)

| Role    | Email                                | Password     |
|---------|--------------------------------------|--------------|
| Admin   | `admin@ganpatuniversity.ac.in`      | `Admin@123`  |
| Staff   | `staff@ganpatuniversity.ac.in`      | `Staff@123`  |
| Student | `meet.patel@ganpatuniversity.ac.in` | `Student@123`|
| Student | `sneha.joshi@ganpatuniversity.ac.in`| `Student@123`|

Public registration always creates **Student** accounts. Staff/Admin accounts are
created by an Admin or seeded — there is no public "register as Staff/Admin" option.

---

## User journeys at a glance

**Student:** register/log in → report a lost item (status `Pending`) → see it in
My Reports → browse/search found items → open an item → edit or delete their own
open report → notifications (approve/reject/claim/resolve) → profile.

**Staff:** log in → log a found item (status `Pending`) → update custody → (admin
approves) → mark it **Claimed** after in-person verification → record the recipient
— name, contact, enrollment number — then **Resolve**. Limited dashboard counts.

**Admin:** everything staff can do, plus **Moderate Posts** (approve/reject →
reporter is notified), **Categories** (CRUD; deleting an in-use category is blocked),
**Users** (activate/suspend/reactivate; cannot suspend self), **Statistics**
(users by role, items by type/status, pending approvals/handovers, resolved counts,
recent activity feed), and **Manage Handovers** across all staff.

---

## API contract (JSON)

Base path: `/backend/public/index.php` → `routes/api.php`.
Every response uses `{ "success": bool, "data": …, "message": "…" }`.

| Method   | Endpoint                          | Roles                    |
|----------|-----------------------------------|--------------------------|
| POST     | `/api/auth/register`              | Guest (creates STUDENT)  |
| POST     | `/api/auth/login`                 | Guest                    |
| POST     | `/api/auth/logout`                | Auth                     |
| GET      | `/api/auth/me` · `/api/profile`   | Auth                     |
| PUT      | `/api/profile`                    | Auth                     |
| GET      | `/api/items?type&status&category&date&location&q` | Auth (role-scoped) |
| GET      | `/api/items/{id}`                 | Auth (role-scoped)       |
| POST     | `/api/items/lost`                 | Auth (any)               |
| POST     | `/api/items/found`                | STAFF/ADMIN              |
| PUT      | `/api/items/{id}`                 | Owner (LOST) / STAFF/ADMIN (FOUND) |
| DELETE   | `/api/items/{id}`                 | Owner, LOST only         |
| PUT      | `/api/items/{id}/custody`         | STAFF/ADMIN              |
| PUT      | `/api/items/{id}/claim`           | STAFF/ADMIN              |
| PUT      | `/api/items/{id}/recipient`       | STAFF/ADMIN              |
| PUT      | `/api/items/{id}/resolve`         | STAFF/ADMIN              |
| PUT      | `/api/items/{id}/moderate`        | ADMIN                    |
| GET/POST | `/api/categories` · PUT/DELETE `/api/categories/{id}` | GET auth / writes ADMIN |
| GET      | `/api/users` · PUT `/api/users/{id}/status` | ADMIN          |
| GET      | `/api/notifications` · PUT `/{id}/read` | Auth (own only)   |
| GET      | `/api/dashboard/staff`            | STAFF/ADMIN              |
| GET      | `/api/dashboard/admin`            | ADMIN                    |
| GET      | `/api/dashboard/student`          | Auth (student summary)   |

Image upload: `multipart/form-data` (field `image`), JPG/PNG/WebP ≤ 5MB.
Works for both `POST` and `PUT` (the backend parses raw PUT multipart bodies).

**Security & privacy**
- Every restricted route re-checks `role` from the **server-side session** and
  returns `403 {"success":false,"message":"Forbidden"}` on violation.
- Received-recipient fields (`recipientName`, `recipientContactNo`,
  `recipientEnrollmentNo`) are **stripped at the API layer** for Student and
  unauthenticated requests — they are never sent, not merely hidden in the UI.
- bcrypt password hashing, `PDO` prepared statements everywhere, session cookies
  `httponly` + `SameSite=Lax`, 30-minute inactivity timeout, server-side validation.

---

## Troubleshooting

- **Login page loads but requests fail** → wrong API URL in `frontend/config/config.js`,
  or Apache/MySQL not running.
- **`Connection refused`** → start MySQL in XAMPP; check `backend/.env` credentials.
- **Photo upload fails** → check `backend/uploads/items/` is writable and file ≤ 5MB.
- **404 on `/api/...`** → Apache hasn't loaded `mod_rewrite` / `AllowOverride All`;
  ensure `public/.htaccess` is present and `AllowOverride` is on for the htdocs vhost.

## Acceptance checklist (build verification)

- [x] Student: register → login → report lost (Pending) → My Reports → edit → delete
- [x] Student cannot log a found item / reach staff endpoints (403)
- [x] Staff: log found → custody → claim → recipient → resolve
- [x] Student never receives recipient details in any API response
- [x] Admin: approve/reject, category CRUD (busy category blocked), suspend/reactivate user, dashboard matches DB counts
- [x] Combined keyword/category/date/location search
- [x] Notifications for approved / rejected / claimed / resolved — visible to the right user
- [x] All passwords stored as bcrypt hashes
- [x] All restricted routes 403 for lower-privileged / anonymous sessions
- [x] Usable at 375px mobile viewport (Bootstrap 5 grid, responsive nav)
- [x] `schema.sql` + `seed.sql` import cleanly with zero manual fixes