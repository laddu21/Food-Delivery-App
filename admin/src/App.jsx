// Import Navbar component

import Navbar from './components/Navbar/Navbar'

// Import Sidebar component

import Sidebar from './components/Sidebar/Sidebar'

// Import Route and Routes from react-router-dom

import { Route, Routes } from 'react-router-dom'

// Import Add component

import Add from './pages/Add/Add'

// Import List component

import List from './pages/List/List'

// Import Orders component

import Orders from './pages/Orders/Orders'

// Import ToastContainer from react-toastify

import { ToastContainer } from 'react-toastify';

// Import CSS for react-toastify

import 'react-toastify/dist/ReactToastify.css';

// Define the App functional component

const App = () => {

  // Return the JSX

  return (

    // Main app div

    <div className='app'>

      {/* ToastContainer for notifications */}

      <ToastContainer />

      {/* Navbar component */}

      <Navbar />

      {/* Horizontal rule */}

      <hr />

      {/* App content div */}

      <div className="app-content">

        {/* Sidebar component */}

        <Sidebar />

        {/* Routes component */}

        <Routes>

          {/* Route for root path */}

          <Route path="/" element={<List />} />

          {/* Route for add path */}

          <Route path="/add" element={<Add />} />

          {/* Route for list path */}

          <Route path="/list" element={<List />} />

          {/* Route for orders path */}

          <Route path="/orders" element={<Orders />} />

        </Routes>

      </div>

    </div>

  )

}

// Export the App component as default

export default App