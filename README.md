# Backend API - Student Mental Health Platform

## 🏗 Architecture Overview

Complete Node.js backend with Firebase integration for the Student Mental Health Platform.

### 📁 Services Layer
- **Assessment Services**: Scoring, recommendations, scheduling
- **Auth Services**: Firebase authentication, user management
- **Database Services**: Firestore repositories for all entities
- **Storage Services**: File upload, CSV processing
- **User Services**: Student, teacher, admin data management
- **Wellness Services**: Journal tracking, mood monitoring
- **Notification Services**: Email, push notifications

### 🔧 Middleware Layer
- **Authentication Middleware**: JWT validation, user session management
- **RBAC Middleware**: Role-based access control
- **Validation Middleware**: Input validation and sanitization

### 🗄 Database Layer
- **Firestore Integration**: Real-time data synchronization
- **Repository Pattern**: Clean data access abstraction
- **Multi-tenant Support**: Organization-based data isolation

### 🚀 Firebase Integration
- **Admin SDK**: Server-side Firebase operations
- **Cloud Functions**: Serverless API endpoints
- **Real-time Features**: Live data updates
- **Authentication**: Firebase Auth integration

### 📊 Features Implemented
- ✅ Assessment engine with intelligent scoring
- ✅ User role management (student, teacher, admin)
- ✅ Organization and school management
- ✅ Wellness tracking and journaling
- ✅ File storage and processing
- ✅ Email notifications and communication
- ✅ Real-time data synchronization
- ✅ CSV import/export functionality
- ✅ API rate limiting and security

## 🎯 Setup Instructions

### Prerequisites
- Node.js 18+
- Firebase CLI installed
- Google Cloud project configured

### Installation
```bash
# Clone this repository
git clone https://github.com/sravan99k/11-02-26-backend.git

# Install dependencies
cd 11-02-26-backend
npm install

# Set up Firebase
firebase login
firebase use your-project-id
firebase deploy --only functions
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit with your Firebase config
nano .env
```

## 🚀 Deployment

### Production Deployment
```bash
# Deploy to Firebase
npm run build
firebase deploy --only functions

# Or deploy to Vercel/Heroku
npm run deploy
```

### Development
```bash
# Start development server
npm run dev

# Run tests
npm test
```

## 📚 API Documentation

### Base URL: `https://your-project-url.cloudfunctions.net/api`

### Key Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/assessments` - Assessment data
- `POST /api/wellness/journal` - Wellness journaling
- `GET /api/users/profile` - User profile management

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- API rate limiting
- CORS configuration
- Firebase security rules

---

**🎉 Ready for production deployment with complete frontend integration!**