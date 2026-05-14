# AFF Cup Organizer

Project full-stack cho de tai: Ung dung to chuc cac tran dau bong da AFF Cup.

## 1. Kien Truc Tong The

Frontend React + TypeScript + Vite goi REST API qua Axios. Backend Node.js + Express to chuc theo MVC + Service + Repository. MySQL luu du lieu, Sequelize lam ORM. Auth dung JWT Bearer token. Phan quyen theo role: USER, ORGANIZER, REFEREE, ADMIN. Socket.io da co san lop ket noi de mo rong realtime cho ty so, su kien tran dau va thong bao.

Luon di theo flow:

Client -> Route -> Middleware Auth/Role -> Controller -> Service -> Repository/Model -> MySQL.

## 2. Project Skeleton

```txt
aff-cup-organizer/
  backend/        Express API, Sequelize models, service nghiep vu
  frontend/       React TypeScript Vite app
  database/       SQL schema MySQL
  README.md       Tai lieu kien truc va huong dan
```

Skeleton nay khong copy logic food delivery. Cac module duoc thay bang domain AFF Cup: giai dau, doi bong, cau thu, san, lich dau, ket qua, su kien, bang xep hang, knockout, tin tuc va dashboard.

## 3. Folder Structure

```txt
backend/src/
  config/         database, role constants
  controllers/    nhan request va tra response
  middleware/     JWT auth, authorize role, error handler
  models/         Sequelize models va associations
  repositories/   BaseRepository cho CRUD data access
  routes/         Express route theo module
  seed/           seed role, user demo, tournament demo
  services/       business logic
  sockets/        Socket.io bootstrap
  utils/          jwt, password, slug, http error

frontend/src/
  components/     ProtectedRoute, CrudPage, StatCard
  contexts/       AuthContext
  layouts/        MainLayout, DashboardLayout
  pages/          public, auth, dashboard
  routes/         React Router config
  services/       apiClient, authApi, resourceApi, socket
  types/          shared TypeScript types
```

## 4. Module Structure

Moi module backend nen co:

```txt
routes/<module>Routes.js
controllers/<module>Controller.js
services/<module>Service.js
repositories/BaseRepository.js hoac repository rieng
models/<Model>.js
```

CRUD don gian dung `CrudService` + `createCrudController`. Module co nghiep vu rieng dung service rieng:

- `schedulingService`: tao/sua lich dau, check trung doi va san.
- `resultService`: cap nhat ty so, winner, emit realtime.
- `standingService`: tinh lai bang xep hang vong bang.
- `bracketService`: tao ban ket tu top 2 moi bang.
- `authService`: dang ky, dang nhap, JWT, profile.

## 5. Database Schema

File SQL: `database/schema.sql`.

Bang chinh:

- `users`, `roles`, `user_roles`: tai khoan va phan quyen.
- `tournaments`: thong tin giai dau.
- `groups`: bang dau trong tournament.
- `teams`, `players`: doi bong va cau thu.
- `stadiums`: san van dong.
- `matches`: lich dau, ty so, stage GROUP/KNOCKOUT.
- `match_events`: ban thang, the phat, thay nguoi, VAR.
- `standings`: bang xep hang tinh theo group.
- `news`: tin tuc/thong bao.
- `notifications`: thong bao he thong.

## 6. API Endpoints

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

CRUD:

- `GET/POST /api/users`, `GET/PUT/DELETE /api/users/:id`
- `GET/POST /api/tournaments`, `GET/PUT/DELETE /api/tournaments/:id`
- `GET/POST /api/groups`, `GET/PUT/DELETE /api/groups/:id`
- `GET/POST /api/teams`, `GET/PUT/DELETE /api/teams/:id`
- `GET/POST /api/players`, `GET/PUT/DELETE /api/players/:id`
- `GET/POST /api/stadiums`, `GET/PUT/DELETE /api/stadiums/:id`
- `GET/POST /api/matches`, `GET/PUT/DELETE /api/matches/:id`
- `GET/POST /api/match-events`, `GET/PUT/DELETE /api/match-events/:id`
- `GET/POST /api/news`, `GET/PUT/DELETE /api/news/:id`
- `GET/POST /api/notifications`, `PUT/DELETE /api/notifications/:id`

Nghiep vu:

- `PATCH /api/matches/:id/result`
- `GET /api/match-events/match/:matchId`
- `GET /api/standings/tournaments/:tournamentId`
- `POST /api/standings/tournaments/:tournamentId/groups/:groupId/recalculate`
- `GET /api/brackets/tournaments/:tournamentId`
- `POST /api/brackets/tournaments/:tournamentId/semi-finals`
- `GET /api/dashboard/summary`

## 7. Auth + Role Flow

1. User dang nhap bang email/password.
2. Backend kiem tra password bcrypt.
3. Backend tra JWT va thong tin user kem roles.
4. Frontend luu token vao `localStorage`.
5. Axios interceptor gui `Authorization: Bearer <token>`.
6. Middleware `authenticate` verify JWT va nap roles tu database.
7. Middleware `authorizeRoles` chan route neu role khong duoc phep.

Quyen:

- USER: xem public schedule, teams, standings, news.
- ORGANIZER: quan ly tournament, group, team, player, stadium, match, standings, bracket, news.
- REFEREE: cap nhat result va match events.
- ADMIN: quan ly tat ca, gom user management.

## 8. Match Scheduling Flow

1. ORGANIZER/ADMIN tao tournament.
2. Tao groups: Group A, Group B.
3. Tao teams va gan `tournamentId`, `groupId`.
4. Tao stadiums.
5. Tao matches voi homeTeam, awayTeam, stadium, referee, matchDate.
6. `schedulingService` check:
   - Home team khac away team.
   - Stadium khong bi trung cung thoi diem.
   - Doi bong khong da hai tran cung thoi diem.
7. Match duoc luu voi status `SCHEDULED`.

## 9. Result Update Flow

1. REFEREE/ADMIN goi `PATCH /api/matches/:id/result`.
2. Backend validate `homeScore`, `awayScore`.
3. Backend cap nhat score, status, winnerTeamId.
4. Neu match thuoc vong bang va da `FINISHED`, backend tinh lai standings.
5. Socket.io emit `match:result-updated`.
6. Frontend co the lang nghe event de refresh realtime.

## 10. Standing Calculation Flow

Cong thuc:

- Win: 3 diem.
- Draw: 1 diem.
- Lose: 0 diem.
- GD = goalsFor - goalsAgainst.
- Sap xep: points, GD, goalsFor, ten doi.

Flow:

1. Lay tat ca teams trong group.
2. Lay tat ca matches `GROUP` da `FINISHED`.
3. Reset thong so tung team ve 0.
4. Duyet match de cong played, won, drawn, lost, GF, GA, GD, points.
5. Sap xep va gan rank.
6. Upsert vao bang `standings`.

## 11. Knockout Bracket Flow

Ban dau skeleton ho tro generate ban ket:

1. Lay groups theo `orderNo`.
2. Lay top 2 cua Group A va Group B tu standings.
3. Tao semifinal 1: A1 vs B2.
4. Tao semifinal 2: B1 vs A2.
5. Ket qua knockout duoc cap nhat qua API result.
6. Co the mo rong service de tao final: winner SF1 vs winner SF2.

## 12. Backend Code Skeleton

File quan trong:

```txt
backend/server.js
backend/src/app.js
backend/src/models/index.js
backend/src/services/schedulingService.js
backend/src/services/resultService.js
backend/src/services/standingService.js
backend/src/services/bracketService.js
backend/src/routes/index.js
```

Vi du route + role:

```js
router.patch(
  '/:id/result',
  authenticate,
  authorizeRoles(ROLES.ADMIN, ROLES.REFEREE),
  matchController.updateResult
);
```

Vi du service tinh diem nam trong:

```txt
backend/src/services/standingService.js
```

## 13. Frontend Code Skeleton

File quan trong:

```txt
frontend/src/App.tsx
frontend/src/routes/AppRoutes.tsx
frontend/src/contexts/AuthContext.tsx
frontend/src/components/ProtectedRoute.tsx
frontend/src/components/CrudPage.tsx
frontend/src/pages/public/
frontend/src/pages/dashboard/
frontend/src/services/resourceApi.ts
```

Dashboard da co route guard theo role. Cac trang CRUD dung `CrudPage` de sinh form, table, create, update, delete cho tung resource.

## 14. Implementation Roadmap Tung Buoc

1. Cai MySQL va tao database bang `database/schema.sql`.
2. Cai backend dependencies, copy `.env.example` thanh `.env`.
3. Chay seed de tao roles, admin, organizer, referee, user demo.
4. Test auth login va route `/api/auth/me`.
5. Nhap tournament, groups, teams, stadiums.
6. Tao lich dau vong bang.
7. Referee cap nhat events va result.
8. Kiem tra standings tu dong tinh lai.
9. Generate knockout semifinals.
10. Bo sung final/third-place neu can.
11. Ket noi Socket.io frontend de realtime score/event.
12. Viet validation chi tiet va test API.
13. Hoan thien UI dashboard theo workflow giang vien yeu cau.

## 15. Lenh Cai Dat Va Chay Project

Tu thu muc root:

```bash
cd aff-cup-organizer
npm install
npm run install:all
```

Tao database:

```bash
mysql -u root -p < database/schema.sql
```

Neu dung PowerShell:

```powershell
Get-Content -Raw .\database\schema.sql | mysql -u root -p
```

Neu PowerShell bao loi `mysql is not recognized`, dung full path MySQL:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "SOURCE D:/IT/JAVA/LAPTRINHDICHVU/aff-cup-organizer/database/schema.sql"
```

Backend:

```bash
cd backend
copy .env.example .env
npm run seed
npm run dev
```

Neu PowerShell bao loi `$LASTEXITCODE` khi goi `npm`, hay dung `npm.cmd`:

```powershell
cd D:\IT\JAVA\LAPTRINHDICHVU\aff-cup-organizer\backend
npm.cmd run seed
npm.cmd run dev
```

Frontend:

```bash
cd frontend
copy .env.example .env
npm run dev
```

Tai khoan seed:

```txt
admin@aff.local / admin123
organizer@aff.local / 123456
referee@aff.local / 123456
user@aff.local / 123456
```

URL mac dinh:

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

### Windows PowerShell quick run

Trong PowerShell, neu `npm` bao loi `$LASTEXITCODE`, luon dung `npm.cmd`.

```powershell
cd D:\IT\JAVA\LAPTRINHDICHVU\aff-cup-organizer
npm.cmd install
npm.cmd run install:all
```

Tao database bang full path MySQL. Lenh nay se hoi password MySQL root:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "SOURCE D:/IT/JAVA/LAPTRINHDICHVU/aff-cup-organizer/database/schema.sql"
```

Mo file `backend\.env` va dien dung password MySQL:

```env
DB_USER=root
DB_PASSWORD=mat_khau_mysql_root_cua_ban
```

Chay backend:

```powershell
cd D:\IT\JAVA\LAPTRINHDICHVU\aff-cup-organizer\backend
npm.cmd run seed
npm.cmd run dev
```

Mo them mot terminal PowerShell moi de chay frontend:

```powershell
cd D:\IT\JAVA\LAPTRINHDICHVU\aff-cup-organizer\frontend
npm.cmd run dev
```

Neu dang o thu muc `backend` ma muon sang frontend:

```powershell
cd ..\frontend
```

### Windows CMD quick run

Mo **Command Prompt** bang `cmd.exe`, khong dung PowerShell.

Cai dependencies:

```bat
cd /d D:\IT\JAVA\LAPTRINHDICHVU\aff-cup-organizer
npm install
npm run install:all
```

Tao database. Neu `mysql` da co trong PATH:

```bat
mysql -u root -p < database\schema.sql
```

Neu CMD bao `mysql is not recognized`, dung full path:

```bat
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < database\schema.sql
```

Neu backend bi `Access denied for user 'root'`, tao user rieng cho project:

```bat
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

Trong man hinh `mysql>`, chay:

```sql
SOURCE D:/IT/JAVA/LAPTRINHDICHVU/aff-cup-organizer/database/create_app_user.sql;
SOURCE D:/IT/JAVA/LAPTRINHDICHVU/aff-cup-organizer/database/schema.sql;
quit;
```

Sau do sua `backend\.env`:

```env
DB_USER=aff_user
DB_PASSWORD=aff123456
```

Tao va sua file `.env` backend:

```bat
copy backend\.env.example backend\.env
notepad backend\.env
```

Trong file `backend\.env`, dien password MySQL:

```env
DB_USER=root
DB_PASSWORD=mat_khau_mysql_root_cua_ban
```

Chay backend:

```bat
cd /d D:\IT\JAVA\LAPTRINHDICHVU\aff-cup-organizer\backend
npm run seed
npm run dev
```

Mo **mot cua so CMD moi** de chay frontend:

```bat
cd /d D:\IT\JAVA\LAPTRINHDICHVU\aff-cup-organizer\frontend
npm run dev
```

URL:

```txt
Backend:  http://localhost:4000
Frontend: http://localhost:5173
```
