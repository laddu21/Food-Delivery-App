
import './Header.css'
import { assets } from '../../assets/assets'
import PropTypes from 'prop-types'

const Header = ({ setCategory }) => {

    const handleViewMenu = () => {
        // Set category to "All" to show all items
        setCategory("All");

        // Scroll to the explore menu section
        setTimeout(() => {
            const element = document.getElementById('explore-menu');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <div className='header'>
            <img src={assets.self_fit} alt="Self.fit" className='header-image' />
            <div className='header-contents'>
                <h2>Order your favourite food here</h2>
                <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
                <button onClick={handleViewMenu}>View Menu</button>
            </div>
        </div>
    )
}

Header.propTypes = {
    setCategory: PropTypes.func.isRequired,
};

export default Header
