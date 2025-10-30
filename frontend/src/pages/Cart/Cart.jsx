import { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { currency, assets } from '../../assets/assets';

const Cart = () => {

  const { cartItems, food_list, aiFoodList, removeFromCart, addToCart, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const hasItemsInCart = getTotalCartAmount() > 0;

  return (
    <div className='cart'>
      <div className="cart-back" onClick={() => navigate(-1)}>
        ← Back
      </div>
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p>Add Items and proceed to checkout</p>
      </div>
      {!hasItemsInCart ? (
        <div className="cart-empty">
          <h2></h2>
        </div>
      ) : (
        <>
          <div className="cart-items">
            <div className="cart-items-title">
              <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
            </div>
            <br />
            <hr />
            {[...food_list, ...aiFoodList].map((item, index) => {
              if (cartItems[item._id] > 0) {
                return (<div key={index}>
                  <div className="cart-items-title cart-items-item">
                    <img src={item.image} alt="" />
                    <p>{item.name}</p>
                    <p>{currency}{item.price}</p>
                    <div className="cart-quantity-controls">
                      <button className="quantity-btn" onClick={() => removeFromCart(item._id)}>-</button>
                      <span>{cartItems[item._id]}</span>
                      <button className="quantity-btn" onClick={() => addToCart(item._id)}>+</button>
                    </div>
                    <p>{currency}{item.price * cartItems[item._id]}</p>
                    <img className='cart-items-remove-icon' onClick={() => removeFromCart(item._id)} src={assets.remove_icon_red} alt="Delete" />
                  </div>
                  <hr />
                </div>)
              }
            })}
          </div>
          <div className="cart-bottom">
            <div className="cart-total">
              <h2>Cart Totals</h2>
              <div>
                <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                <hr />
                <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : 5}</p></div>
                <hr />
                <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b></div>
              </div>
              <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
            </div>
            <div className="cart-promocode">
              <div>
                <p>If you have a promo code, Enter it here</p>
                <div className='cart-promocode-input'>
                  <input type="text" placeholder='promo code' />
                  <button>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
