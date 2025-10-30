import { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import PropTypes from 'prop-types'
import AIBot from '../AIBot/AIBot'

const Navbar = ({ setShowLogin, isLoggedIn, onLogout }) => {

  const [menu, setMenu] = useState("home");
  const [showAIBot, setShowAIBot] = useState(false);
  const { getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = () => {
    setMenu("menu");
    if (location.pathname !== '/') {
      navigate('/');
      // Scroll after navigation
      setTimeout(() => {
        const element = document.getElementById('explore-menu');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleContactClick = () => {
    setMenu("contact");
    if (location.pathname !== '/') {
      navigate('/');
      // Scroll after navigation
      setTimeout(() => {
        const element = document.getElementById('footer');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <>
      <div className='navbar'>
        <Link to='/'><h1>Self.fit</h1></Link>
        <ul className="navbar-menu">
          <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>Home</Link>
          {location.pathname === '/' ? (
            <a href='#explore-menu' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>Menu</a>
          ) : (
            <span onClick={handleMenuClick} className={`${menu === "menu" ? "active" : ""}`} style={{ cursor: 'pointer' }}>Menu</span>
          )}
          {location.pathname === '/' ? (
            <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>Contact us</a>
          ) : (
            <span onClick={handleContactClick} className={`${menu === "contact" ? "active" : ""}`} style={{ cursor: 'pointer' }}>Contact us</span>
          )}
          {isLoggedIn && <Link to="/myorder" onClick={() => setMenu("orders")} className={`${menu === "orders" ? "active" : ""}`}>My Orders</Link>}
        </ul>
        <div className="navbar-right">
          <div className="ai-bot-icon" onClick={() => setShowAIBot(true)} title="AI Food Assistant">
            <span className="miracle-icon">✨</span>
          </div>
          <Link to='/cart' className='navbar-search-icon'>
            <img src={assets.basket_icon} alt="" />
            <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
          </Link>
          <button onClick={isLoggedIn ? onLogout : () => setShowLogin(true)}>{isLoggedIn ? "logout" : "sign in"}</button>
        </div>
      </div>
      {showAIBot && (
        <AIBot
          setShowAIBot={setShowAIBot}
          isLoggedIn={isLoggedIn}
          setShowLogin={setShowLogin}
        />
      )}
    </>
  )
}

Navbar.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Navbar
