# Food Delivery App 🍕

A full-stack food delivery application built with React, Node.js, Express, and MongoDB. Features a customer-facing frontend, admin panel for restaurant management, and a robust backend API.

## 🚀 Features

### Customer Features
- **Browse Menu**: Explore a wide variety of food items with categories
- **AI Food Search**: Intelligent search functionality for food recommendations
- **User Authentication**: Secure login and registration
- **Shopping Cart**: Add, remove, and manage cart items
- **Order Placement**: Seamless ordering with delivery address
- **Order History**: View past orders and order status

### Admin Features
- **Food Management**: Add, edit, and remove food items
- **Order Management**: View and manage customer orders
- **Dashboard**: Comprehensive admin panel for restaurant operations

### Technical Features
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live order status tracking
- **Secure Payments**: Integrated payment processing (Stripe)
- **Image Upload**: Cloud-based image storage for food items
- **JWT Authentication**: Secure token-based authentication

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Stripe** - Payment processing

### Deployment
- **Render** - Cloud hosting platform
- **MongoDB Atlas** - Cloud database

## 📋 Prerequisites

Before running this application, make sure you have:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

## 🔧 Installation

### Clone the Repository
```bash
git clone https://github.com/laddu21/Swiggy-UI.git
cd Swiggy-UI
```

### Backend Setup
```bash
cd Food-app/backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Add your MongoDB Atlas connection string and JWT secret
```

### Frontend Setup
```bash
cd ../frontend
npm install
```

### Admin Setup
```bash
cd ../admin
npm install
```

## 🚀 Running the Application

### Development Mode

1. **Start Backend**:
```bash
cd Food-app/backend
npm run server
```
Server will run on `http://localhost:4004`

2. **Start Frontend**:
```bash
cd Food-app/frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

3. **Start Admin**:
```bash
cd Food-app/admin
npm run dev
```
Admin will run on `http://localhost:5174`

### Production Build

1. **Build Frontend**:
```bash
cd Food-app/frontend
npm run build
```

2. **Build Admin**:
```bash
cd Food-app/admin
npm run build
```

## 🌐 Deployment

This application is configured for deployment on Render:

### Backend Deployment
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key

### Frontend & Admin Deployment
1. Create Static Sites on Render
2. Connect your GitHub repository
3. Set build command: `cd frontend && npm install && npm run build` (for frontend)
4. Set publish directory: `frontend/dist` (for frontend)
5. Repeat for admin with appropriate paths

## 📁 Project Structure

```
Food-app/
├── admin/                 # Admin panel
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── assets/
│   └── package.json
├── backend/               # Backend API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
├── frontend/              # Customer frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── Context/
│   │   └── assets/
│   └── package.json
└── README.md
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory with:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=4004
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Shaik Rabbani** - *Full Stack Developer* - [GitHub](https://github.com/laddu21)

## 🙏 Acknowledgments

- Inspired by popular food delivery platforms
- Built with modern web technologies
- Thanks to the open-source community

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Happy Coding! 🚀**