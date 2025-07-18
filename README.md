# CRUD Generator : NestJS + Nuxt3

โปรเจกต์นี้เป็นเครื่องมือสำหรับสร้างโค้ด CRUD (Create, Read, Update, Delete) อัตโนมัติ รองรับทั้งฝั่ง Backend (NestJS) และ Frontend (Nuxt3)

## วิธีการติดตั้ง

```bash
npm install
```

## โครงสร้างไฟล์หลัก

```
crud-generator/
├── crud-gen-backend/      # โค้ดฝั่ง NestJS (Backend)
├── crud-gen-frontend/     # โค้ดฝั่ง Nuxt3 (Frontend)
├── tools/
│   ├── schemas/           # ตัวอย่าง schema สำหรับ generate
│   └── templates/         # template สำหรับ generate ไฟล์
├── plopfile.js            # กำหนด logic ของ generator
├── package.json           # dependencies หลัก
└── README.md
```

- **crud-gen-backend/** : โค้ดฝั่ง Backend (NestJS)
- **crud-gen-frontend/** : โค้ดฝั่ง Frontend (Nuxt3)
- **tools/schemas/** : เก็บไฟล์ schema ที่ใช้สำหรับ generate (แนะนำให้สร้าง schema ใหม่ในนี้)
- **tools/templates/** : เก็บ template สำหรับ generate ไฟล์ต่าง ๆ
- **plopfile.js** : กำหนด logic และ flow ของ generator
- **package.json** : ข้อมูล dependencies หลักของโปรเจกต์

## วิธีการใช้งาน

1. สร้างไฟล์ schema ที่ต้องการใน `tools/schemas/` เช่น

```js
// tools/schemas/product.js
module.exports = {
  name: 'product',
  fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'price', type: 'number', required: true },
    { name: 'isActive', type: 'boolean', required: false },
  ],
};
```

2. รันคำสั่ง plop เพื่อเริ่มต้น generator

```bash
npx plop
```

3. เลือกว่าจะ Create หรือ Delete
4. กำหนด destination
5. เลือกชื่อ schema ที่จะสร้าง
6. ไฟล์ที่สร้างจะอยู่ในโฟลเดอร์ที่กำหนดไว้

## ตัวอย่างการใช้งาน

```bash
npx plop
# เลือก "create crud"
# กำหนด destination
# เลือกชื่อ Schema ที่จะสร้าง (เช่น product)
# ระบบจะสร้างไฟล์ CRUD ให้โดยอัตโนมัติ
```

## ข้อกำหนดเบื้องต้น

- Node.js
- npm