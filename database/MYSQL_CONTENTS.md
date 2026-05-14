# MySQL content for AFF Cup Organizer

File nay de nguoi khac co the mo, doc va khoi tao lai database MySQL cua project khi ban khong co mat.

## 1. Thong tin ket noi

Thong tin backend dang dung nam trong `backend/.env`.

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=aff_cup_organizer
DB_USER=root
DB_PASSWORD=270306
```

Neu muon dung user rieng cua project:

```env
DB_USER=aff_user
DB_PASSWORD=aff123456
```

## 2. Mo bang MySQL Workbench

Tao connection moi:

```txt
Connection Name: AFF Cup Organizer
Hostname: 127.0.0.1
Port: 3306
Username: root
Password: 270306
Default Schema: aff_cup_organizer
```

Sau khi ket noi, mo:

```txt
SCHEMAS > aff_cup_organizer > Tables
```

Muon xem du lieu thi chuot phai vao bang va chon `Select Rows - Limit 1000`.

## 3. Mo bang CMD

```bat
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p270306 aff_cup_organizer
```

Lenh xem nhanh:

```sql
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM teams;
SELECT * FROM players;
SELECT * FROM stadiums;
SELECT * FROM matches;
SELECT * FROM standings;
SELECT * FROM news;
SELECT * FROM notifications;
```

## 4. Cac file tao database

```txt
database/schema.sql              Tao database va cac bang
database/create_app_user.sql     Tao user MySQL aff_user / aff123456
backend/src/seed/seed.js         Tao du lieu mau cho project
```

Neu can tao lai database tu dau:

```bat
cd /d D:\IT\JAVA\LAPTRINHDICHVU\aff-cup-organizer
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p270306 < database\schema.sql
cd backend
npm run seed
```

Neu dang dung PowerShell thay vi CMD:

```powershell
cd D:\IT\JAVA\LAPTRINHDICHVU\aff-cup-organizer
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p270306 -e "SOURCE D:/IT/JAVA/LAPTRINHDICHVU/aff-cup-organizer/database/schema.sql"
cd backend
npm run seed
```

## 5. Tai khoan dang nhap trong app

```txt
admin@aff.local / admin123
organizer@aff.local / 123456
referee@aff.local / 123456
user@aff.local / 123456
```

## 6. Du lieu mau hien co

Seed hien tai tao:

```txt
Users: 4
Roles: 4
Tournaments: 1
Groups: 2
Teams: 8
Players: 48
Stadiums: 4
Matches: 14
Match events: 41
Standings: 8
News: 3
Notifications: 4
```

Bang chinh:

```txt
roles           Quyen USER, ORGANIZER, REFEREE, ADMIN
users           Tai khoan dang nhap
user_roles      Gan quyen cho user
tournaments     Giai dau AFF Cup 2026
groups          Group A, Group B
teams           8 doi bong
players         Cau thu cua cac doi
stadiums        San van dong
matches         Lich dau va ket qua
match_events    Su kien tran dau
standings       Bang xep hang
news            Tin tuc/thong bao
notifications   Thong bao nguoi dung
```

## 7. SQL kiem tra du lieu

Danh sach doi theo bang:

```sql
SELECT g.name AS group_name, t.name AS team, t.short_name
FROM teams t
LEFT JOIN `groups` g ON g.id = t.group_id
ORDER BY g.order_no, t.name;
```

Bang xep hang:

```sql
SELECT
  g.name AS group_name,
  t.name AS team,
  s.played,
  s.won,
  s.drawn,
  s.lost,
  s.goals_for,
  s.goals_against,
  s.goal_difference,
  s.points,
  s.rank
FROM standings s
JOIN teams t ON t.id = s.team_id
JOIN `groups` g ON g.id = s.group_id
ORDER BY g.order_no, s.rank;
```

Lich dau:

```sql
SELECT
  m.id,
  ht.short_name AS home,
  at.short_name AS away,
  m.stage,
  m.round,
  m.status,
  m.home_score,
  m.away_score,
  m.match_date
FROM matches m
JOIN teams ht ON ht.id = m.home_team_id
JOIN teams at ON at.id = m.away_team_id
ORDER BY m.match_date;
```
