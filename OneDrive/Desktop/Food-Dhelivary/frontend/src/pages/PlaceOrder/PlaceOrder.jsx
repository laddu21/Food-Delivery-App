import { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets, currency } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    })

    const { getTotalCartAmount, placeOrder, orderStatus } = useContext(StoreContext);

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    useEffect(() => {
        if (getTotalCartAmount() === 0) {
            navigate('/')
        }
    }, [getTotalCartAmount, navigate])

    useEffect(() => {
        if (orderStatus === 'success') {
            alert("Order placed successfully");
            navigate('/myorder');
        }
    }, [orderStatus, navigate])

    return (
        <div className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' />
                <div className="multi-field">
                    <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' />
                    <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' />
                </div>
                <div className="multi-field">
                    <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' />
                    <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' />
                </div>
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : 5}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b></div>
                    </div>
                </div>
                <div className="payment-options">
                    <h2>Select Payment Method</h2>
                    <div className="payment-option">
                        <img src={assets.selector_icon} alt="" />
                        <p>COD ( Cash On Delivery )</p>
                    </div>
                    {orderStatus === 'placing' && (
                        <div className="order-progress">
                            <p>Placing your order...</p>
                            <div className="progress-bar">
                                <div className="progress-fill"></div>
                            </div>
                        </div>
                    )}
                    {orderStatus === 'error' && (
                        <div className="order-error">
                            <p>❌ Failed to place order. Please try again.</p>
                        </div>
                    )}
                    <button
                        onClick={() => placeOrder(data)}
                        disabled={orderStatus === 'placing'}
                    >
                        {orderStatus === 'placing' ? 'Placing Order...' : 'PLACE ORDER'}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default PlaceOrder
