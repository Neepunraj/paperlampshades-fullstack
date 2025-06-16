# paperlampshades-fullstack
🛒 
This project is a full-stack e-commerce platform built using Node.js, Express.js, TypeScript, and Next.js.
It includes features such as user authentication, admin access, shopping cart, product management, orders, payment integration via PayPal, image uploads via Cloudinary, bot protection with Arcjet, and more.

🚀 Features
✅ User Authentication & Authorization (JWT + JOSE)

✅ Admin Role Middleware (isSuperAdmin)

✅ Product Management

✅ Shopping Cart System

✅ Orders & Coupons

✅ Payments via PayPal

✅ Image Upload (up to 5 images) stored in Cloudinary

✅ Email Validation, Bot Protection, Rate Limiting via Arcjet

✅ Fully Dockerized Environment

✅ Prisma ORM for PostgreSQL Database

✅ Modular Express.js Server Architecture

🛠 Technologies Used
Frontend
Next.js (TypeScript)

Backend
Node.js (Express.js, TypeScript)

Database
PostgreSQL (Prisma ORM)

Deployment
Docker

Middleware
JWT (JSON Web Token)

JOSE (JavaScript Object Signing and Encryption)

Custom Middlewares:

isSuperAdmin (Role-based access control)

upload (File upload middleware for Cloudinary)

Storage
Cloudinary (for image uploads)

Payment Gateway
PayPal

Bot Protection & Security
Arcjet (Email validation, bot protection, and rate limiting)
to use this git clone my repo 
and
create env variables  
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
ARCJET_SECRET=your_arcjet_secret
JWT_SECRET=your_jwt_secret

for prisma 
npx prisma generate
npx prisma migrate dev

for docker 
docker-compose up

cd server/
npm i
npm run dev

cd client 
npm i
npm run dev
singing up
![image](https://github.com/user-attachments/assets/64eda0ba-c1cf-4cce-a104-32285a9b2c23)
#signing in
![signing and loggin](https://github.com/user-attachments/assets/9b00477a-ff8a-430b-9ac1-d644b94ab264)
admin login and admin dash view
![image](https://github.com/user-attachments/assets/0fd5e521-5cee-458d-ac25-8fcd15f4e55a)
admin dashview to add new product 
![image](https://github.com/user-attachments/assets/7bce68c3-c76f-4468-bc4d-692a5d075f93)
creating new product with formdata and button 
![image](https://github.com/user-attachments/assets/f63bdf79-4be3-44c4-9bb2-f8dd68032e96)
orders page
![image](https://github.com/user-attachments/assets/09fa4f28-7d95-4214-b597-e6b93588e434)
coupon list page
![image](https://github.com/user-attachments/assets/a4f4c681-2876-46fa-bbbe-62f0430816b5)
creating coupon 
![image](https://github.com/user-attachments/assets/43e0c59b-fa64-44c4-b83d-a975c7205d32)
featuring product and banners 
![image](https://github.com/user-attachments/assets/bccf7c58-1a7a-4b4f-9cc8-82e6315b1d83)




