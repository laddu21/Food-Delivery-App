// Import useState and useEffect hooks from React

import { useState, useEffect } from 'react'

// Import Home component

import Home from './pages/Home/Home'

// Import Footer component

import Footer from './components/Footer/Footer'

// Import Navbar component

import Navbar from './components/Navbar/Navbar'

// Import Route, Routes, useNavigate, useLocation from react-router-dom

import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'

// Import Cart component

import Cart from './pages/Cart/Cart'

// Import LoginPopup component

import LoginPopup from './components/LoginPopup/LoginPopup'

// Import PlaceOrder component

import PlaceOrder from './pages/PlaceOrder/PlaceOrder'

// Import MyOrders component

import MyOrders from './pages/MyOrders/MyOrders'

// Define the App functional component

const App = () => {

  // State for showing login popup

  const [showLogin, setShowLogin] = useState(false);

  // State for login status

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hook for navigation

  const navigate = useNavigate();

  // Hook for location

  const location = useLocation();

  // Effect to check authentication

  useEffect(() => {

    // Get token from localStorage

    const token = localStorage.getItem("token");

    // Set isLoggedIn based on token presence

    setIsLoggedIn(!!token);

  }, []);

  // Effect to handle protected routes

  useEffect(() => {

    // Define protected routes

    const protectedRoutes = ['/cart', '/order', '/myorder'];

    // Check if current path is protected and user not logged in

    if (protectedRoutes.includes(location.pathname) && !isLoggedIn) {

      // Show login popup

      setShowLogin(true);

      // Navigate to home

      navigate('/');

    }

  }, [location.pathname, isLoggedIn, navigate]);

  // Function to handle logout

  const handleLogout = () => {

    // Remove token from localStorage

    localStorage.removeItem("token");

    // Set isLoggedIn to false

    setIsLoggedIn(false);

  };

  // Return the JSX

  return (

    // Fragment

    <>

      {/* Conditional rendering of LoginPopup */}

      {showLogin ? <LoginPopup setShowLogin={setShowLogin} onLoginSuccess={() => setIsLoggedIn(true)} /> : <></>}

      {/* Main app div */}

      <div className='app'>

        {/* Navbar component */}

        <Navbar setShowLogin={setShowLogin} isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        {/* Routes component */}

        <Routes>

          {/* Route for home */}

          <Route path='/' element={<Home />} />

          {/* Route for cart */}

          <Route path='/cart' element={isLoggedIn ? <Cart /> : <Home />} />

          {/* Route for order */}

          <Route path='/order' element={isLoggedIn ? <PlaceOrder /> : <Home />} />

          {/* Route for myorder */}

          <Route path='/myorder' element={isLoggedIn ? <MyOrders /> : <Home />} />

        </Routes>

      </div>

      {/* Conditional rendering of Footer */}

      {location.pathname !== '/myorder' && location.pathname !== '/cart' && <Footer />}

    </>

  )

}

// Export the App component as default

export default App
