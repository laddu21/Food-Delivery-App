import { useContext, useEffect } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets, currency } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const MyOrders = () => {
  const { fetchUserOrders, userOrders } = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserOrders()
  }, [fetchUserOrders])

  return (
    <div className='my-orders'>
      <div className="cart-back" onClick={() => navigate(-1)}>
        ← Back
      </div>
      <h2>My Orders</h2>
      <div className="container">
        {userOrders.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.basket_icon} alt="" />
            <p>{order.items.map((item, index) => {
              if (index === order.items.length - 1) {
                return item.name + " x " + item.quantity
              } else {
                return item.name + " x " + item.quantity + ", "
              }
            })}</p>
            <p>{currency}{order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
            <button>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders
