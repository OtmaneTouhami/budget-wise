# BudgetWise+ 💰
### Smart Personal Finance Tracker

![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech Stack](https://img.shields.io/badge/Stack-Spring%20Boot%20%2B%20React-green)

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🚀 Project Overview

**BudgetWise+** is a modern, full-stack web application designed to help users take control of their personal finances. Track income and expenses, categorize transactions, set budgets, and visualize financial trends with beautiful, interactive charts.

### 🎯 One-liner
*A sleek, full-stack web app to track income and expenses, categorize transactions, set budgets, and visualize financial trends — powered by Spring Boot and React.*

### 🏆 ALX SE Portfolio Project
This project represents the culmination of the ALX Software Engineering Webstack specialization, demonstrating proficiency in:
- Full-stack web development
- RESTful API design and implementation
- Database design and management
- User authentication and security
- Modern frontend frameworks
- Third-party API integration

**Project Timeline:** June 27 - July 10, 2025  
**Team:** Otmane Touhami

---

## ✨ Features

### 🔑 Core Features (MVP)
- **👤 User Authentication**: Secure JWT-based login and registration system
- **💰 Transaction Management**: Complete CRUD operations for income and expense tracking
- **📂 Category Management**: Custom category creation and management
- **📊 Interactive Dashboard**: Real-time financial overview with visual analytics
- **📅 Smart Filtering**: Filter transactions by date ranges (today, week, month, custom)
- **📤 Data Export**: Export transaction history to CSV format

### 🌟 Advanced Features (Stretch Goals)
- **💸 Budget Alerts**: Smart notifications when approaching spending limits
- **🧾 Receipt Upload**: Image upload and storage for transaction receipts
- **📱 SMS Notifications**: Real-time alerts via Twilio integration
- **📈 Trend Analysis**: Historical spending patterns and insights
- **🎨 Responsive Design**: Seamless experience across all devices
- **✉️ Email Notifications**: Account verification and notifications via SendGrid.
- **🔁 Recurring Transactions**: Automate scheduling of regular income and expenses.
- **📋 Transaction Templates**: Create transactions from predefined templates.

---

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security + JWT Authentication
- **Database**: Spring Data JPA + Hibernate + MariaDB
- **API Documentation**: SpringDoc (Swagger/OpenAPI)
- **File Storage**: AWS S3 for receipt uploads
- **Notifications**: Twilio API for SMS alerts, SendGrid for email
- **DTO Mapping**: MapStruct
- **Utilities**: Lombok, Spring Dotenv

### Frontend
- **Framework**: React 19
- **Routing**: React Router DOM
- **State Management**: Context API / Redux Toolkit
- **HTTP Client**: Axios
- **Charts**: Chart.js / Recharts
- **Styling**: CSS3 + Responsive Design
- **Build Tool**: Vite

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Database**: MySQL 8.0
- **API Testing**: Postman
- **Development**: VS Code - intellij IDE

---

## 🏗 Architecture

### System Design
Our application follows a clean, layered architecture pattern:

#### Backend Architecture
```
├── Controller Layer (REST APIs)
├── Service Layer (Business Logic)
├── Repository Layer (Data Access)
└── Entity Layer (Data Models)
```

#### Database Schema
![Class Diagram](./Conception/ClassDiagram.jpg)

*The class diagram above illustrates our database design, showing relationships between Users, Transactions, Categories, Budgets, and supporting entities.*

### Key Entities
- **User**: Authentication and profile management
- **Transaction**: Income and expense records with categorization
- **Category**: User-defined spending categories
- **Budget**: Monthly spending limits per category
- **Receipt**: Optional transaction receipt storage
- **RecurringTransaction**: Automated recurring transactions

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+**
- **Node.js 16+**
- **MariaDB 10.5+**
- **Maven 3.6+**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OtmaneTouhami/budget-wise.git
   cd budget-wise
   ```

2. **Backend Setup**
   ```bash
   cd api
   mvn clean install
   # Configure database in application.properties
   mvn spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Database Setup**
   ```sql
   CREATE DATABASE budgetwise;
   -- Tables will be auto-created via JPA
   ```

### Environment Variables
Create a `.env` file in the `api` backend directory with the following variables:

**Backend (`api/.env`)**
```
# Database Configuration
DB_URL=jdbc:mariadb://localhost:3306/budgetwise
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_and_long_jwt_key
JWT_EXPIRATION_MS=86400000 # 24 hours
JWT_REFRESH_EXPIRATION_MS=604800000 # 7 days

# AWS S3 Configuration (for file storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=your_aws_region

# SendGrid Configuration (for email notifications)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=your_verified_sender_email@example.com

# Twilio Configuration (for SMS notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_TRIAL_NUMBER=your_twilio_phone_number
```

**Frontend (`frontend/.env`)**
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## 📋 API Documentation

All endpoints are prefixed with `/api/v1`.

### Authentication Endpoints (`/auth`)
- `POST /register`: User registration
- `POST /login`: User login
- `POST /verify`: Verify user account with a token
- `POST /resend-verification`: Resend verification token
- `POST /refresh`: Refresh JWT token
- `POST /logout`: Invalidate refresh token

### User Profile Endpoints (`/profile`)
- `GET /`: Get user profile
- `PUT /`: Update user profile
- `POST /change-password`: Change user password
- `DELETE /`: Delete user account

### Transaction Endpoints (`/transactions`)
- `GET /`: Get all transactions (with date filtering)
- `POST /`: Create new transaction
- `GET /{id}`: Get a single transaction
- `PUT /{id}`: Update transaction
- `DELETE /{id}`: Delete transaction
- `GET /export`: Export transactions to CSV
- `POST /from-template/{templateId}`: Create a transaction from a template

### Category Endpoints (`/categories`)
- `GET /`: Get all categories for the user
- `POST /`: Create new category
- `GET /{id}`: Get a single category
- `PUT /{id}`: Update category
- `DELETE /{id}`: Delete category

### Budget Endpoints (`/budgets`)
- `GET /`: Get all budgets (with year/month filtering)
- `POST /`: Create/update budget
- `GET /{id}`: Get a single budget
- `PUT /{id}`: Update a budget
- `DELETE /{id}`: Delete a budget

### Receipt Endpoints
- `POST /transactions/{transactionId}/receipts`: Upload and attach a receipt
- `GET /transactions/{transactionId}/receipts`: Get all receipts for a transaction
- `DELETE /receipts/{receiptId}`: Delete a specific receipt

### Recurring Transaction Endpoints (`/recurring-transactions`)
- `GET, POST /`: Get all or create a new recurring transaction
- `GET, PUT, DELETE /{id}`: Get, update, or delete a specific one
- `PATCH /{id}/status`: Activate or deactivate a recurring transaction

### Transaction Template Endpoints (`/transaction-templates`)
- `GET, POST /`: Get all or create a new transaction template
- `GET, PUT, DELETE /{id}`: Get, update, or delete a specific template

### Dashboard Endpoints (`/dashboard`)
- `GET /stats`: Get financial statistics for a date range

### Notification Endpoints (`/notifications`)
- `GET /`: Get all notifications for the user
- `POST /{id}/read`: Mark a notification as read
- `POST /read-all`: Mark all notifications as read

### Global Data Endpoints (`/countries`)
- `GET /`: Get a list of all countries
- `GET /{id}`: Get a single country by ID

*Full API documentation available at `/api/v1/api-docs` and Swagger UI at `/swagger-ui.html` when running the backend.*

---

## 🎯 Learning Objectives

This project demonstrates mastery of:

✅ **Backend Development**
- RESTful API design and implementation
- JWT authentication and authorization
- Database design and ORM usage
- File upload and storage
- Third-party API integration

✅ **Frontend Development**
- Modern React development patterns
- State management and component architecture
- Responsive design principles
- Data visualization and charting
- Form handling and validation

✅ **Full-Stack Integration**
- Frontend-backend communication
- Error handling and user feedback
- Security best practices
- Performance optimization

✅ **Project Management**
- Agile development methodology
- Version control with Git
- Documentation and code organization
- Testing and debugging

---

## 🗓 Development Schedule

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Setup & Auth** | Days 1-2 | ✅ Project setup, JWT authentication |
| **Core CRUD** | Days 3-4 | ✅ Transaction and category APIs |
| **Frontend CRUD** | Days 5-6 | ⏳ React components and forms |
| **Dashboard** | Days 7-8 | ⏳ Charts and data visualization |
| **Filtering & Export** | Days 9-10 | ✅ Date filters and CSV export |
| **Advanced Features** | Days 11-12 | ✅ Budget alerts, file upload, recurring txns |
| **Polish & Deploy** | Days 13-14 | ⏳ Testing, bug fixes, deployment |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Team

**Otmane Touhami**
- GitHub: [@OtmaneTouhami](https://github.com/OtmaneTouhami)
- Email: otmanetouhami.dev@gmail.com
- LinkedIn: [Otmane Touhami](https://linkedin.com/in/otmane-touhami)

*ALX Software Engineering Student*

---

## 🚧 Current Status

**Phase**: Backend Complete, Frontend Development Initiated<br>
**Completed**: Full backend API implementation including authentication, core CRUD (transactions, categories, budgets), and advanced features (receipts, notifications, recurring transactions, templates).<br>
**In Progress**: Frontend React components for CRUD operations.<br>
**Next**: Connecting frontend to backend, building the dashboard with data visualization.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **ALX Africa** - For the comprehensive software engineering program
- **The ALX SE Community** - For continuous support and collaboration
- **Open Source Libraries** - For the amazing tools that make this project possible

---

**Made with ❤️ as part of the ALX SE Webstack Portfolio Project**
