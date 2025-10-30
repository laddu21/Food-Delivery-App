
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
      <h1>Self.fit</h1>
      {/* Use correct property access for image asset */}
        <img className="profile" src={assets.professional_half_pic} alt="Professional Half" />
      </div>
  )
}

export default Navbar
