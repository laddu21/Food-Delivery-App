// Import the CSS file for styling the Sidebar component

import './Sidebar.css'

// Import assets object from the assets file

import { assets } from '../../assets/assets'

// Import NavLink component from react-router-dom for navigation links

import { NavLink } from 'react-router-dom'

// Define the Sidebar functional component

const Sidebar = () => {

  // Return the JSX structure for the sidebar

  return (

    // Main container div with sidebar class

    <div className='sidebar'>

      {/* Container div for sidebar options */}

      <div className="sidebar-options">

        {/* NavLink component linking to the add page */}

        <NavLink to='/add' className="sidebar-option">

          {/* Image element for the add icon */}

          <img src={assets.add_icon} alt="" />

          {/* Paragraph element with text &quot;Add Items&quot; */}

          <p>Add Items</p>

        </NavLink>

        {/* NavLink component linking to the list page */}

        <NavLink to='/list' className="sidebar-option">

          {/* Image element for the order icon (used for list) */}

          <img src={assets.order_icon} alt="" />

          {/* Paragraph element with text &quot;List Items&quot; */}

          <p>List Items</p>

        </NavLink>

        {/* NavLink component linking to the orders page */}

        <NavLink to='/orders' className="sidebar-option">

          {/* Image element for the order icon */}

          <img src={assets.order_icon} alt="" />

          {/* Paragraph element with text &quot;Orders&quot; */}

          <p>Orders</p>

        </NavLink>

      </div>

    </div>

  )

}

// Export the Sidebar component as default

export default Sidebar
