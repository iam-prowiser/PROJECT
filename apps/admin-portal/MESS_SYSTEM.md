# MessBook - Mess Management System

A comprehensive admin portal for managing daily mess menus with MongoDB integration.

## Features

### Homepage
- **Meal Booking Interface**: Matches the provided design with orange/coral theme
- **Booking Details**: Date selector and meal type dropdown
- **Mess Timings**: Visual display of breakfast, lunch, snacks, and dinner times
- **Admin Access**: Direct link to admin login

### Admin Portal
- **Secure Login**: JWT-based authentication
- **Menu Management**: Add, edit, and delete daily menus
- **Real-time Updates**: Immediate reflection of changes
- **Responsive Design**: Works on all screen sizes

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + JWT Authentication
- **Database**: MongoDB with automatic connection management
- **UI Components**: Radix UI + Custom Styling

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login

### Menu Management (Protected)
- `GET /api/admin/menus` - Get all menu entries
- `POST /api/admin/menus` - Create new menu entry
- `PUT /api/admin/menus/:id` - Update menu entry
- `DELETE /api/admin/menus/:id` - Delete menu entry

### Public Access
- `GET /api/menus/:date` - Get menus for specific date

## Database Structure

### Menu Entry Schema
```json
{
  "_id": "ObjectId",
  "date": "YYYY-MM-DD",
  "mealType": "breakfast|lunch|snacks|dinner",
  "menu": "Menu items description",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Environment Variables

```env
MONGODB_URI=mongodb://your-mongodb-connection-string
DATABASE_NAME=messbook
JWT_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

## Routes

- `/` - Homepage with meal booking interface
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin menu management dashboard

## Features Implemented

✅ **Homepage Design**: Matches the provided meal booking interface design  
✅ **Admin Authentication**: Secure JWT-based login system  
✅ **Menu CRUD Operations**: Complete Create, Read, Update, Delete functionality  
✅ **MongoDB Integration**: Persistent storage with automatic connection management  
✅ **Responsive Design**: Works perfectly on desktop and mobile  
✅ **Real-time Updates**: Changes reflect immediately  
✅ **Error Handling**: Comprehensive error handling and user feedback  
✅ **Data Validation**: Server-side validation for all inputs  
✅ **Conflict Prevention**: Prevents duplicate menus for same date/meal type  

## MongoDB Setup

The system automatically connects to MongoDB using the connection string in `MONGODB_URI`. If no connection string is provided, it defaults to `mongodb://localhost:27017`.

The database schema is automatically created when the first menu entry is added.

## Theme Colors

The application uses a custom orange-based color scheme extracted from the design:
- **Primary Orange**: `hsl(25 100% 55%)`
- **Light Orange**: `hsl(25 100% 95%)`
- **Dark Orange**: `hsl(25 100% 45%)`
- **Gray Background**: `hsl(210 20% 98%)`

## Usage

1. **Homepage**: Users can view the meal booking interface and mess timings
2. **Admin Login**: Admins can access the management portal via `/admin/login`
3. **Menu Management**: Add daily menus with date, meal type, and menu items
4. **Menu Editing**: Click edit button to modify existing entries
5. **Menu Deletion**: Remove outdated or incorrect entries

The system is production-ready and can be deployed with any MongoDB cluster connection string.
