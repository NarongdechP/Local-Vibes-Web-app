# Local-Vibes-Web-app

Local Vibes เป็นเว็บแอปที่พัฒนาด้วย React สำหรับ Frontend และ Express.js สำหรับ Backend

# โครงสร้างโปรเจกต์

```
Local-Vibes-Web-app/
├── docker-compose.yml        # config สำหรับ Docker Compose
├── README.md
├── server/                   # Backend (Node.js + Express)
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   ├── config/
│   │   ├── db.js             # เชื่อมต่อ mongodb atlas
│   ├── middleware/
│   │   ├── authMiddleware.js
│   ├── model/
│   │   ├── Event.js          # database ของกิจกรรม
│   │   ├── User.js           # database ของผู้ใช้
│   ├── routes/
│   │   ├── authenRoutes.js   # API
│   │   ├── eventRoutes.js    # API
│   └── server.js             #
├── src/                      # Frontend (React + Vite)
│   ├── Dockerfile
│   ├── index.html
│   ├── main.jsx
│   ├── components/
│   │   ├── EventCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SearchBar.jsx
│   ├── assets/
│   │   ├── react.svg
│   ├── pages/
│   │   ├── Create_Event.css
│   │   ├── Create_Event.jsx  # หน้าสำหรับสร้างอีเวนต์
│   │   ├── Home.css
│   │   ├── Home.jsx          # หน้าหลักของเว็บ
│   │   ├── Login.css
│   │   ├── Login.jsx         # หน้าล็อกอิน
│   │   ├── Register.css
│   │   ├── Register.jsx      # หน้าสมัครสมาชิก
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── postcss.config.cjs
```

# วิธีการรันโปรเจกต์ด้วย Docker Compose

1. clone repo และเข้าโฟล์เดอร์โปรเจกต์

   ```
   git clone https://github.com/NarongdechP/Local-Vibes-Web-app
   cd Local-Vibes-Web-app
   ```

2. เพิ่มไฟล์ .env ใน server/.env ภายในไฟล์อย่างน้อยต้องประกอบไปด้วย
   2.1 MONGO_URI ของฐานข้อมูล
   2.2 JWT_SECRET
   2.3 NODE_ENV สามารถเลือกได้ว่าเป็นแบบ development หรือ production

3. ตรวจสอบการติดตั้ง Docker Desktop ด้วย docker -v
   ถ้ายังไม่ได้ติดตั้ง `https://www.docker.com/products/docker-desktop/`

4. สร้าง Docker image ใหม่โดยจะไม่ใช้ cache เดิม

   ```
   docker-compose build --no-cache
   ```

5. สร้างและรัน container ตามรายละเอียดใน docker-compose.yml

   ```
   docker-compose up
   ```

6. ถ้าต้องการหยุดและลบ container, network, volume ที่สร้างจาก docker-compose up
   ```
   docker-compose down
   ```

# สิ่งที่ยังทำไม่ได้และแนวคิดว่าจะพัฒนาต่อ

- พัฒนาระบบแจ้งเตือน
- แผนที่ที่แสดงกิจกรรมที่มีการสร้างในเว็บ
- หน้าแสดงกิจกรรมที่ชื่นชอบ
- หน้ารายละเอียดของผู้ใช้
- การเปลี่ยนรหัสผ่าน, เปลี่ยนอีเมลของผู้ใช้
- สามารถรันบนเครื่องเซิร์ฟเวอร์ (หรือ EC2 Instance)
