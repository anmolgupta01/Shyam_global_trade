# 🏢 Shyam Global Trade - Full-Stack Application

A modern web application for **Shyam Global Trade**, featuring product catalogs, contact management, and an administrative dashboard with both frontend and backend components.

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [File Upload & Management](#-file-upload--management)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support--contact)

---

## 🌟 Overview
Shyam International Trade is a comprehensive trading company web application specializing in **Unbreakable Households, Crocklings, and premium quality products**.  

This full-stack solution provides both **customer-facing features** and **administrative management tools**.

### Key Highlights
- ⚛️ Modern React frontend with responsive design  
- 🚀 Robust Node.js/Express backend API  
- 🗄️ MongoDB database for scalable data management  
- 🛍️ Comprehensive product and contact management  
- 📧 Email notification system  
- 📁 File upload capabilities  
- 📊 Admin dashboard with analytics  

---

## ✨ Features

### 🌐 Frontend Features
- 📱 **Responsive Design** – Mobile-first, works on all devices  
- 🛍️ **Product Catalog** – Search, filter, and browse products  
- 🎠 **Image Carousel** – Dynamic banner management  
- 📧 **Contact Form** – User inquiries with validation  
- ⚙️ **Admin Dashboard** – Product & contact management  
- 🔄 **Real-time Updates** – Dynamic content management  

### 🚀 Backend Features
- 🛡️ **RESTful API** – Comprehensive CRUD operations  
- 📁 **File Management** – Image upload and storage  
- ✉️ **Email Service** – Automated notifications  
- 🔒 **Security** – Rate limiting, CORS, input validation  
- 📊 **Database Operations** – Optimized MongoDB queries  
- ♻️ **Auto-cleanup** – File deletion on record removal  

---

## 🛠 Technology Stack

### Frontend
| Technology      | Purpose              |
|-----------------|----------------------|
| React 18.2.0    | UI framework         |
| React Router DOM| Client-side routing  |
| Tailwind CSS    | Styling framework    |
| Lucide React    | Icon library         |
| Axios           | HTTP client          |

### Backend
| Technology     | Purpose                  |
|----------------|--------------------------|
| Node.js 18+    | Runtime environment      |
| Express.js 4.18+| Web framework           |
| MongoDB 4.4+   | Database                 |
| Mongoose       | ODM for MongoDB          |
| Multer         | File upload handling     |
| Nodemailer     | Email service            |

---

## 📁 Project Structure
shyam-international/
├── client/ # Frontend React application
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ ├── common/ # Reusable components
│ │ │ ├── home/ # Homepage components
│ │ │ ├── products/ # Product-related components
│ │ │ ├── admin/ # Admin dashboard components
│ │ │ └── ui/ # UI components
│ │ ├── hooks/ # Custom React hooks
│ │ ├── pages/ # Page components
│ │ ├── services/ # API services
│ │ └── utils/ # Utility functions
│ ├── package.json
│ └── tailwind.config.js
├── server/ # Backend Node.js application
│ ├── controllers/ # Route controllers
│ ├── models/ # Database models
│ ├── routes/ # API routes
│ ├── middleware/ # Custom middleware
│ ├── utils/ # Utility functions
│ ├── uploads/ # File storage
│ │ ├── products/ # Product images
│ │ └── banners/ # Banner images
│ ├── config/ # Configuration files
│ ├── package.json
│ └── server.js
├── README.md
└── .gitignore


---

## 📦 Installation

### Prerequisites
- Node.js **18.0+**
- MongoDB **4.4+**
- npm or yarn
- Git

### Quick Setup
```bash
# Clone repo
git clone https://github.com/your-username/shyam-international.git
cd shyam-international

# Backend setup
cd server
npm install

# Frontend setup
cd ../client
npm install
Set up .env files (see below).
Start MongoDB via system service or Docker.

🔧 Environment Configuration
Backend (server/.env)
# Server Configuration
NODE_ENV=development
PORT=5001

# Database Configuration
MONGODB_URI=

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
FRONTEND_URL_PROD=https://your-domain.com

# Security Configuration  
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random-please-change-this-in-production
# Email Configuration

EMAIL_USER=
EMAIL_PASS=

# Admin Email Recipients
ADMIN_EMAIL_1=
ADMIN_EMAIL_2=
ADMIN_EMAIL_3=

# Alternative SMTP Configuration (if not using Gmail)
# SMTP_HOST=
# SMTP_PORT=587
# SMTP_SECURE=false

CACHE_TTL=3600

ADMIN_USERNAME=
ADMIN_PASSWORD=
# Cloud Services (Cloudinary - Optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Frontend (client/.env)

REACT_APP_API_URL=https://shyam-international.onrender.com


🚀 Running the Application
Development
# Backend
cd server
npm start

# Frontend
cd client
npm start
Backend → https://shyam-international.onrender.com

Frontend → http://localhost:3000

Production
# Build frontend
cd client
npm run build

# Start backend
cd ../server
npm start
With PM2:
pm2 start server.js --name "shyam-api"
API Documentation

Base URL:
https://shyam-international.onrender.com/api
Products API

GET /api/products – Fetch products (supports search, pagination, filters)

POST /api/products – Create new product (multipart/form-data)

PUT /api/products/:id – Update product

DELETE /api/products/:id – Delete product

Contact API

POST /api/contact/submit – Submit inquiry

GET /api/contact – Admin fetch inquiries

Banners API

GET /api/banners – Fetch all banners

POST /api/banners – Upload new banner

Health Check

GET /api/health

File Upload & Management

📂 Storage → server/uploads/

📏 Max Size → 5MB

🖼 Formats → JPG, JPEG, PNG, GIF, WEBP

♻️ Auto cleanup on record removal

🚀 Deployment

Supports manual deployment and Docker Compose.
Includes production-ready configs with PM2 and Nginx.

🧪 Testing

npm test in both frontend & backend (when test suite implemented).

Manual checklist includes CRUD, file uploads, contact form, responsiveness.

🤝 Contributing

Fork repo

Create feature branch

Commit changes

Push & open PR

Follow ESLint, write tests, and update docs.

📄 License

Licensed under the MIT License. See LICENSE file.

📞 Support & Contact

Company: Shyam global Trade
Website: www.shyamglobaltrade.com

Address: Dostpur, Sultanpur (U.P.)

📱 Phone: 9794226856, 8318076180
📧 Email:

getanmol.gupta@gmail.com

getrg9794226856@gmail.com

<div align="center"> <h3>🏢 Shyam Global Trade</h3> <p><i>Building Quality Trading Solutions</i></p> <p><b>Made with ❤️ in Sultanpur, U.P.</b></p> </div> ```
