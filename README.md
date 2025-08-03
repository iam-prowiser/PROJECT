# BYTEBITE - Unified Smart Mess Manager

A unified monorepo containing all BYTEBITE applications for smart campus dining management.

NOTE - To connect database for testing , you can contact me at  ( rajaadarsh25@gmail.com ). For now i have removed the database access for security purpose, Thank You !

## 🏗️ Project Structure

```
bytebite-unified/
├── apps/
│   ├── landing-page/     # Main landing page (Port: 3000)
│   ├── admin-portal/     # Admin dashboard (Port: 3001)
│   ├── feedback-page/    # Feedback system (Port: 3002)
│   └── todays-menu/      # Today's menu (Port: 3003)
├── package.json          # Root package.json with unified scripts
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start all applications:**
   ```bash
   npm run dev
   ```

This will start all 4 applications simultaneously:
- Landing Page: http://localhost:3000
- Admin Portal: http://localhost:3001
- Feedback Page: http://localhost:3002
- Today's Menu: http://localhost:3003

## 📱 Individual Applications

### Landing Page (Port 3000)
- Main entry point for users
- Features: Hero section, problem/solution showcase, navigation to other apps
- Technologies: React, Vite, Tailwind CSS, Framer Motion

### Admin Portal (Port 3001)
- Administrative dashboard for mess management
- Features: User management, analytics, system controls
- Technologies: React, MongoDB, JWT authentication

### Feedback Page (Port 3002)
- Student feedback collection system
- Features: Feedback forms, ratings, comments
- Technologies: React, MongoDB, Express

### Today's Menu (Port 3003)
- Real-time menu display and management
- Features: Daily menu updates, availability tracking
- Technologies: React, MongoDB, Express

## 🛠️ Development Scripts

### Root Level Commands
```bash
# Start all applications
npm run dev

# Start individual applications
npm run dev:landing    # Port 3000
npm run dev:admin      # Port 3001
npm run dev:feedback   # Port 3002
npm run dev:menu       # Port 3003

# Build all applications
npm run build

# Build individual applications
npm run build:landing
npm run build:admin
npm run build:feedback
npm run build:menu

# Install all dependencies
npm run install:all

# Clean all node_modules
npm run clean
```

### Individual App Commands
Each app in the `apps/` directory has its own scripts:
```bash
cd apps/landing-page
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## 🔧 Configuration

### Port Configuration
- Landing Page: 3000
- Admin Portal: 3001
- Feedback Page: 3002
- Today's Menu: 3003

### Environment Variables
Each application may have its own `.env` file in its respective directory. Check each app's documentation for specific environment variables.

## 🌐 Navigation Flow

1. **Landing Page (3000)** - Main entry point
   - "Start Smart" button → Opens modal with options
   - "Admin Portal" button → Direct link to admin (3001)
   - Modal options:
     - "Book Slot" → Booking page (internal route)
     - "Give Feedback" → Feedback page (3002)
     - "See Menu" → Today's menu (3003)

2. **Cross-application navigation** - Each app can link to others using the configured ports

## 🚀 Deployment

### Individual Deployment
Each application can be deployed independently:
```bash
cd apps/[app-name]
npm run build
npm run start
```

### Unified Deployment
For production, you might want to:
1. Build all applications: `npm run build`
2. Set up a reverse proxy (nginx) to route traffic to appropriate apps
3. Use environment variables to configure production URLs

## 🔍 Troubleshooting

### Port Conflicts
If you encounter port conflicts:
1. Check if any other services are using the configured ports
2. Update the port in the respective `vite.config.ts` file
3. Update the navigation URLs in the landing page

### Installation Issues
If you encounter installation issues:
```bash
# Clean all node_modules and reinstall
npm run clean
npm run install:all
```

### Development Issues
- Ensure all applications are running on their designated ports
- Check browser console for any CORS issues
- Verify that all environment variables are properly set

## 📝 Contributing

1. Each application maintains its own structure and dependencies
2. Make changes in the respective app directory
3. Test the changes by running the individual app
4. Test the unified setup by running `npm run dev`

## 🎯 Features

### Unified Benefits
- **Single Repository**: All related applications in one place
- **Consistent Development**: Shared tooling and configurations
- **Easy Deployment**: Unified build and deployment process
- **Cross-application Navigation**: Seamless user experience

### Individual App Features
Each application maintains its original functionality while being part of the unified ecosystem.

---

**Note**: This is a monorepo structure that consolidates 4 previously separate applications into a unified development and deployment experience while maintaining all original features and functionality. 
