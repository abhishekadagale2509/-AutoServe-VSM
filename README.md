# 🚗 AutoServe VSM

### Vehicle Service Management System

<p align="center">
  A full-stack vehicle service management platform built with React, Spring Boot, MySQL, Razorpay and a dedicated Vehicle Tips Microservice.
</p>

---

## 📌 About the Project

**AutoServe VSM** is a full-stack **Vehicle Service Management System** designed to digitize and simplify the complete vehicle servicing lifecycle.

The system connects **Customers, Mechanics and Administrators** through a centralized platform.

Customers can manage their vehicles, book service appointments, track service progress, view job cards, make online payments and download paid invoice PDFs.

Mechanics can manage assigned service work and maintain detailed job cards containing inspection notes, work done, mechanic remarks, spare parts and service costs.

Administrators can manage customers, mechanics and overall service operations.

The project also includes a dedicated **Vehicle Tips Microservice** that provides vehicle-specific maintenance tips based on the selected vehicle type.

---

# ✨ Features

## 👤 Customer

- 🔐 Registration and Login
- 🎟️ JWT Authentication
- 👤 Profile Management
- 🔒 Change Password
- 🚗 Vehicle Management
- 📅 Appointment Booking
- 📊 Appointment Tracking
- 🔎 Appointment Search
- 📜 Service History
- 🔧 Job Card Viewing
- 📝 Inspection Notes Viewing
- 🛠️ Work Done Viewing
- 💬 Mechanic Remarks Viewing
- 🧾 Invoice Viewing
- 💳 Online Payment
- 📄 Paid Invoice PDF Download
- 💡 Vehicle Maintenance Tips

---

## 🔧 Mechanic

- 🔐 Mechanic Login
- 📊 Mechanic Dashboard
- 📅 Assigned Appointments
- 🔧 Job Card Management
- 🔄 Service Status Updates
- 🔍 Inspection Notes
- 🛠️ Work Done
- 💬 Mechanic Remarks
- 🔩 Spare Parts
- 💰 Labor Cost
- 👤 Mechanic Profile
- 🔒 Change Password

---

## 🛡️ Administrator

- 🔐 Admin Login
- 📊 Admin Dashboard
- 👥 Customer Management
- 🔧 Mechanic Management
- 🚗 Vehicle Management
- 📅 Appointment Management
- 💳 Payment Monitoring
- 👤 Admin Profile
- 📈 System Monitoring

> **Note:** The current Admin account is configured as a hard-coded/demo account for project demonstration purposes.

---

# 🎯 Project Objectives

The main objectives of AutoServe are:

1. Digitize the vehicle service booking process.
2. Maintain centralized customer and vehicle information.
3. Manage service appointments efficiently.
4. Allow mechanics to maintain digital job cards.
5. Provide customers with service progress and service history.
6. Generate invoices based on completed service work.
7. Support online payment through Razorpay.
8. Restrict invoice PDF downloads until payment is completed.
9. Provide vehicle-specific maintenance tips through a microservice.
10. Implement secure role-based access control.

---

# 🔐 Authentication & Authorization

AutoServe uses **Spring Security with JWT-based authentication**.

The system supports three primary roles:

| Role | Access |
|------|--------|
| 👤 `CUSTOMER` | Customer dashboard and service features |
| 🔧 `MECHANIC` | Assigned service and job card features |
| 🛡️ `ADMIN` | Administrative features |

Frontend routes and backend APIs are protected according to the authenticated user's role.

---

# 🚗 Vehicle Management

Customers can add and manage their vehicles.

Vehicle information includes:

- Vehicle Brand
- Vehicle Model
- Vehicle Number
- Vehicle Type
- Manufacturing Year

Registered vehicles can then be selected while creating service appointments.

---

# 📅 Appointment Management

Customers can create service appointments for their registered vehicles by providing the required vehicle and problem/service information.

### Appointment Flow

```text
Customer
   │
   ▼
Select Vehicle
   │
   ▼
Enter Problem / Service Details
   │
   ▼
Create Appointment
   │
   ▼
Appointment Processing
   │
   ▼
Mechanic Service Work
```

Customers can:

- Create appointments
- View active appointments
- Track appointment status
- Search appointments
- View previous appointments

---

# 🔧 Job Card Management

The **Job Card** contains the actual details of the service work performed on a vehicle.

### Job Card Information

- 🔍 Inspection Notes
- 🛠️ Work Done
- 💬 Mechanic Remarks
- 🔩 Spare Parts
- 💰 Labor Cost
- 💵 Estimated Cost
- 💵 Final Cost
- 🔄 Job Status

### Service Flow

```text
Appointment
     │
     ▼
Mechanic Service
     │
     ▼
Job Card
     │
     ├── Inspection Notes
     ├── Work Done
     ├── Mechanic Remarks
     ├── Spare Parts
     └── Labor Cost
     │
     ▼
Final Cost
     │
     ▼
Invoice
     │
     ▼
Payment
```

Customers can view the relevant completed service information from their job cards.

---

# 👤 Profile Management

Separate profile functionality is available for the different user roles.

### Customer Profile

- View profile
- Update profile
- Change password

### Mechanic Profile

- View profile
- Update profile
- Change password

### Admin Profile

- View admin profile
- Manage account information

---

# 🔐 Authentication & Authorization

AutoServe uses **Spring Security with JWT-based authentication**.

The system supports three primary roles:

| Role | Access |
|------|--------|
| 👤 `CUSTOMER` | Customer dashboard and service features |
| 🔧 `MECHANIC` | Assigned service and job card features |
| 🛡️ `ADMIN` | Administrative features |

Frontend routes and backend APIs are protected according to the authenticated user's role.

---

# 🚗 Vehicle Management

Customers can add and manage their vehicles.

Vehicle information includes:

- Vehicle Brand
- Vehicle Model
- Vehicle Number
- Vehicle Type
- Manufacturing Year

Registered vehicles can then be selected while creating service appointments.

---

# 📅 Appointment Management

Customers can create service appointments for their registered vehicles by providing the required vehicle and problem/service information.

### Appointment Flow

```text
Customer
   │
   ▼
Select Vehicle
   │
   ▼
Enter Problem / Service Details
   │
   ▼
Create Appointment
   │
   ▼
Appointment Processing
   │
   ▼
Mechanic Service Work
```

Customers can:

- Create appointments
- View active appointments
- Track appointment status
- Search appointments
- View previous appointments

---

# 🔧 Job Card Management

The **Job Card** contains the actual details of the service work performed on a vehicle.

### Job Card Information

- 🔍 Inspection Notes
- 🛠️ Work Done
- 💬 Mechanic Remarks
- 🔩 Spare Parts
- 💰 Labor Cost
- 💵 Estimated Cost
- 💵 Final Cost
- 🔄 Job Status

### Service Flow

```text
Appointment
     │
     ▼
Mechanic Service
     │
     ▼
Job Card
     │
     ├── Inspection Notes
     ├── Work Done
     ├── Mechanic Remarks
     ├── Spare Parts
     └── Labor Cost
     │
     ▼
Final Cost
     │
     ▼
Invoice
     │
     ▼
Payment
```

Customers can view the relevant completed service information from their job cards.

---

# 👤 Profile Management

Separate profile functionality is available for the different user roles.

### Customer Profile

- View profile
- Update profile
- Change password

### Mechanic Profile

- View profile
- Update profile
- Change password

### Admin Profile

- View admin profile
- Manage account information

---

# 💡 Vehicle Tips Microservice

AutoServe includes an independently running **Vehicle Tips Microservice** built using Spring Boot.

The purpose of this microservice is to provide maintenance tips according to the selected vehicle type.

### Supported Vehicle Types

```text
🚗 CAR
🏍️ BIKE
🚚 TRUCK
```

---

## 🧩 Microservice Architecture

The React frontend does **not directly communicate with the Vehicle Tips Microservice**.

Instead, the communication takes place through the main AutoServe backend.

```text
┌─────────────────────┐
│   React Frontend    │
│      :3000          │
└──────────┬──────────┘
           │
           │ REST API
           ▼
┌─────────────────────┐
│  AutoServe Backend  │
│   Spring Boot :8080 │
└──────────┬──────────┘
           │
           │ HTTP Request
           ▼
┌──────────────────────────┐
│ Vehicle Tips Microservice│
│    Spring Boot :8081    │
└──────────────────────────┘
```

---

## 🔄 Vehicle Tips Flow

```text
Customer Dashboard
       │
       ▼
Select Vehicle
       │
       ▼
Determine Vehicle Type
       │
       ▼
React Frontend
       │
       ▼
AutoServe Backend :8080
       │
       ▼
VehicleTipsClient
       │
       ▼
Vehicle Tips Service :8081
       │
       ▼
Vehicle-specific Tips
       │
       ▼
Customer Dashboard
```

### Example

When the customer selects:

```text
Sonet → CAR
```

the system displays the maintenance tips for a car.

When the customer selects:

```text
Activa → BIKE
```

the system displays the maintenance tips for a bike.

The customer can switch between registered vehicles using the Vehicle Tips selector on the Customer Dashboard.

---

# 🌐 Microservice Ports

| Component | Port |
|-----------|------|
| ⚛️ React Frontend | `3000` |
| 🌱 AutoServe Backend | `8080` |
| 💡 Vehicle Tips Microservice | `8081` |
| 🐬 MySQL | `3306` |

---

# 🏗️ System Architecture

```text
                           ┌─────────────────┐
                           │    CUSTOMER     │
                           └────────┬────────┘
                                    │
                                    ▼
                       ┌────────────────────────┐
                       │    REACT FRONTEND     │
                       │       Port 3000       │
                       └───────────┬────────────┘
                                   │
                              REST APIs
                                   │
                                   ▼
              ┌────────────────────────────────────┐
              │        AUTOSERVE BACKEND           │
              │          Spring Boot :8080         │
              │                                    │
              │  • Authentication                  │
              │  • Customers                       │
              │  • Mechanics                       │
              │  • Admin                           │
              │  • Vehicles                        │
              │  • Appointments                    │
              │  • Job Cards                       │
              │  • Invoices                        │
              │  • Payments                        │
              └──────────────┬───────────┬─────────┘
                             │           │
                             │           │ HTTP
                             │           ▼
                             │   ┌──────────────────────┐
                             │   │ Vehicle Tips         │
                             │   │ Microservice :8081   │
                             │   └──────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │      MySQL      │
                    │     Database    │
                    └─────────────────┘

                             │
                             ▼
                    ┌─────────────────┐
                    │    Razorpay     │
                    │    Payments     │
                    └─────────────────┘
```

---

# 🛠️ Technology Stack

## 🎨 Frontend

| Technology | Purpose |
|------------|---------|
| ⚛️ React | User Interface |
| ⚡ Vite | Development and Build Tool |
| 🧭 React Router | Client-side Routing |
| 📡 Axios | REST API Communication |
| 🎨 Bootstrap | UI Design |
| 🔹 Bootstrap Icons | Icons |
| 🔔 React Toastify | Notifications |

---

## ⚙️ Main Backend

| Technology | Purpose |
|------------|---------|
| ☕ Java 21 | Programming Language |
| 🌱 Spring Boot 4.1.0 | Backend Framework |
| 🌐 Spring Web MVC | REST APIs |
| 🔐 Spring Security | Security |
| 🎟️ JWT | Authentication |
| 🗃️ Spring Data JPA | Data Access |
| 💤 Hibernate | ORM |
| 🛠️ Maven | Build & Dependency Management |
| 🐬 MySQL | Relational Database |
| 🍃 Lombok | Boilerplate Reduction |

---

## 💡 Vehicle Tips Microservice

| Technology | Purpose |
|------------|---------|
| ☕ Java 21 | Programming Language |
| 🌱 Spring Boot 4.1.0 | Microservice Framework |
| 🌐 Spring Web | REST APIs |
| 🛠️ Maven | Build & Dependency Management |

---

## 💳 Payment

| Technology | Purpose |
|------------|---------|
| Razorpay | Online Payment Processing |

---

# 📂 Project Structure

```text
AutoServe-VSM/
│
├── 📁 Backend/
│   │
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/
│   │   │   │   └── 📁 com/project/autoserve/
│   │   │   │       ├── 📁 client/
│   │   │   │       ├── 📁 config/
│   │   │   │       ├── 📁 controller/
│   │   │   │       ├── 📁 dto/
│   │   │   │       ├── 📁 entity/
│   │   │   │       ├── 📁 enums/
│   │   │   │       ├── 📁 exception/
│   │   │   │       ├── 📁 repository/
│   │   │   │       ├── 📁 security/
│   │   │   │       ├── 📁 service/
│   │   │   │       └── 📁 util/
│   │   │
│   │   │   └── 📁 resources/
│   │   │
│   │   └── 📁 test/
│   │
│   └── pom.xml
│
├── 📁 Frontend/
│   │
│   ├── 📁 src/
│   │   ├── 📁 api/
│   │   ├── 📁 components/
│   │   │   ├── 📁 common/
|   |   |   ├── 📁 dashboard/
|   |   |   ├── 📁 jobcard/
|   |   |   └── 📁 routes/
│   │   ├── 📁 context/
│   │   ├── 📁 pages/
│   │   │   ├── 📁 admin/
|   |   |   ├── 📁 auth/
│   │   │   ├── 📁 customer/
│   │   │   └── 📁 mechanic/
│   │   ├── 📁 services/
│   │   └── 📁 utils/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── 📁 VehicleTipsService/
│   │
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/
│   │   │   └── 📁 resources/
│   │   └── 📁 test/
│   │
│   └── pom.xml
│
├── 📄 README.md
└── 📄 .gitignore
```

---

# ⚙️ Prerequisites

Before running AutoServe, install the following:

### Required

- ☕ Java 21
- 📦 Maven
- 🟢 Node.js
- 📦 npm
- 🐬 MySQL
- 🌐 Git

### Recommended Development Tools

- Eclipse / Spring Tool Suite
- Visual Studio Code
- MySQL Workbench
- Postman
- Google Chrome / Microsoft Edge

---

# 🚀 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd AutoServe-VSM
```

---

## 2️⃣ Configure MySQL

Create the database:

```sql
CREATE DATABASE autoserve_db;
```

Then configure the database connection inside:

```text
Backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/autoserve_db
spring.datasource.username=<your-username>
spring.datasource.password=<your-password>
```

> ⚠️ Never commit real database credentials to GitHub.

---

## 3️⃣ Start the AutoServe Backend

Open:

```text
Backend/
```

Run the main Spring Boot application:

```text
AutoServeVsmApplication
```

The backend runs on:

```text
http://localhost:8080
```

---

## 4️⃣ Start the Vehicle Tips Microservice

Open:

```text
VehicleTipsService/
```

Run:

```text
VehicleTipsServiceApplication
```

The microservice runs on:

```text
http://localhost:8081
```

---

## 5️⃣ Start the Frontend

Open a terminal inside:

```text
Frontend/
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

---

# ▶️ Running the Complete Application

Start the components in this order:

```text
1. 🐬 MySQL
       ↓
2. 🌱 AutoServe Backend :8080
       ↓
3. 💡 Vehicle Tips Microservice :8081
       ↓
4. ⚛️ React Frontend :3000
```

Then open:

```text
http://localhost:3000
```

---

# 🔑 Demo Credentials

The project currently includes demo credentials for local testing and academic/project demonstration.

> ⚠️ These credentials are intended for local/demo use only and should not be used as production credentials.

| Role | Email | Password |
|------|-------|----------|
| 🛡️ **ADMIN** | `admin@autoserve.com` | `Admin@123` |
| 👤 **CUSTOMER** | `aditya@gmail.com` | `Password@123` |
| 🔧 **MECHANIC** | `amit@gmail.com` | `Amit@123` |

The Login page also provides **Quick Demo Login Autofill** buttons for these accounts.

### Admin Account

The current Admin account is configured as a **hard-coded/demo account** for the project.

For a production deployment, administrator credentials should be managed securely rather than being hard-coded.

---

# 🔌 Main API Modules

The main AutoServe backend API base URL is:

```text
http://localhost:8080/api
```

---

## 🔐 Authentication

```text
POST /api/auth/login
POST /api/auth/register
```

---

## 👤 Customer Profile

```text
GET /api/customer/profile
PUT /api/customer/profile
```

---

## 🚗 Vehicles

```text
GET    /api/vehicles
POST   /api/vehicles
PUT    /api/vehicles/{id}
DELETE /api/vehicles/{id}
```

---

## 📅 Appointments

```text
GET  /api/appointments
POST /api/appointments
```

---

## 🧾 Invoices

```text
POST /api/invoices/generate/{jobId}

GET /api/invoices/{invoiceId}

GET /api/invoices/jobcard/{jobId}

GET /api/invoices

GET /api/invoices/{invoiceId}/pdf
```

---

## 💡 Vehicle Tips

Main Backend:

```text
GET /api/vehicle-tips/{vehicleType}
```

Vehicle Tips Microservice:

```text
GET /api/tips/{vehicleType}
```

Example:

```text
GET http://localhost:8081/api/tips/CAR
```

---

# 🧪 Testing

The application can be tested using:

- 🌐 Browser
- 📮 Postman
- ⚛️ Frontend UI
- 🧪 Spring Boot application logs

### Frontend

```text
http://localhost:3000
```

### Main Backend

```text
http://localhost:8080
```

### Vehicle Tips Microservice

```text
http://localhost:8081
```

### Example Vehicle Tips Test

```text
GET http://localhost:8081/api/tips/CAR
```

The same feature can also be tested through the Customer Dashboard by switching between registered vehicles.

---

# 🔒 Security

AutoServe implements multiple security mechanisms:

- 🔐 JWT Authentication
- 🛡️ Spring Security
- 👥 Role-Based Authorization
- 🔒 Protected Frontend Routes
- 🔐 Protected Backend APIs
- 💳 Payment Verification
- 📄 Protected Invoice PDF Downloads

Sensitive configuration such as:

- Database passwords
- JWT secrets
- Razorpay secrets

should be stored outside the repository for production deployment.

---

# 🌱 Git Workflow

The project uses Git and GitHub for version control.

A recommended branch structure is:

```text
main
 │
 ├── feature/authentication
 ├── feature/profile-management
 ├── feature/payments
 ├── feature/vehicle-tips
 └── feature/ui-polish
```

Typical workflow:

```bash
git status

git add .

git commit -m "feat: description"

git push
```

The `main` branch should contain stable, tested code.

---

# 📈 Current Project Status

## 🔐 Authentication

- [x] Customer Login
- [x] Mechanic Login
- [x] Admin Login
- [x] JWT Authentication
- [x] Role-Based Authorization

## 👤 Customer

- [x] Customer Dashboard
- [x] Vehicle Management
- [x] Appointment Booking
- [x] Appointment History
- [x] Appointment Search
- [x] Job Card Viewing
- [x] Service History
- [x] Invoice Viewing
- [x] Payment
- [x] Profile Management
- [x] Change Password
- [x] Vehicle Maintenance Tips

## 🔧 Mechanic

- [x] Mechanic Dashboard
- [x] Assigned Appointments
- [x] Job Card Management
- [x] Inspection Notes
- [x] Work Done
- [x] Mechanic Remarks
- [x] Spare Parts
- [x] Labor Cost
- [x] Profile Management
- [x] Change Password

## 🛡️ Admin

- [x] Admin Dashboard
- [x] Customer Management
- [x] Mechanic Management
- [x] Vehicle Management
- [x] Appointment Management
- [x] Profile Management

## 💳 Payments & Invoices

- [x] Invoice Generation
- [x] Razorpay Integration
- [x] Payment Status
- [x] Invoice PDF Generation
- [x] PDF Download Restriction Before Payment

## 🎨 UI

- [x] Responsive Dashboard
- [x] Role-Based Navigation
- [x] Confirmation Modals
- [x] Loading States
- [x] Toast Notifications
- [x] Vehicle Tips UI

## 💡 Microservice

- [x] Vehicle Tips Microservice
- [x] CAR Tips
- [x] BIKE Tips
- [x] TRUCK Tips
- [x] Backend-to-Microservice Communication
- [x] Frontend Integration

---

# 🚀 Future Enhancements

Possible future improvements include:

- 📧 Email notifications
- 📱 SMS notifications
- ⭐ Customer service ratings
- 🔔 Automated service reminders
- 📊 Advanced Admin analytics
- 🏢 Multiple service center support
- 🧑‍🔧 Advanced mechanic assignment
- 📈 Service history analytics
- 🐳 Docker containerization
- ☁️ Cloud deployment
- 📚 Swagger/OpenAPI documentation
- 🔐 Production-ready secret management

---

# 🏆 Project Highlights

## Full-Stack Development

```text
React
  ↓
Spring Boot REST API
  ↓
MySQL
```

## Secure Authentication

```text
React
  ↓
JWT
  ↓
Spring Security
  ↓
Role-Based APIs
```

## Online Payment

```text
Customer
  ↓
Razorpay
  ↓
Payment Verification
  ↓
Invoice PDF Access
```

## Microservice Integration

```text
React Frontend
      ↓
AutoServe Backend
      ↓
Vehicle Tips Microservice
```

---

# 📊 Project Architecture Summary

| Component | Technology | Port |
|-----------|------------|------|
| 🎨 Frontend | React + Vite | `3000` |
| ⚙️ Main Backend | Spring Boot | `8080` |
| 💡 Vehicle Tips | Spring Boot Microservice | `8081` |
| 🐬 Database | MySQL | `3306` |
| 💳 Payment | Razorpay | External |

---

# 👨‍💻 Project Details

| Item | Details |
|------|---------|
| **Project** | AutoServe – Vehicle Service Management System |
| **Type** | Full-Stack Web Application with Microservice Integration |
| **Frontend** | React |
| **Backend** | Spring Boot |
| **Database** | MySQL |
| **Authentication** | JWT + Spring Security |
| **Payment Gateway** | Razorpay |
| **Microservice** | Vehicle Tips Service |

---

# 📄 License

This project was developed for **educational and academic purposes**.

---

<div align="center">

# 🚗 AutoServe VSM

### Simplifying Vehicle Service Management

**React • Spring Boot • MySQL • Spring Security • Razorpay • Microservices**

</div>