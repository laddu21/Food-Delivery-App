import { createContext, useEffect, useState } from "react";
import { menu_list, url, food_list as staticFoodList } from "../assets/assets";
import axios from "axios";
import PropTypes from 'prop-types';
export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState({});
    const [food_list, setFoodList] = useState([]);
    const [aiFoodList, setAiFoodList] = useState([]);
    const [orderStatus, setOrderStatus] = useState(null); // null, 'placing', 'success', 'error'
    const [userOrders, setUserOrders] = useState([]);

    const fetchFoodList = async () => {
        // Always include static data
        const transformedStaticFoodList = staticFoodList.map(item => ({
            _id: item.food_id.toString(),
            name: item.food_name,
            image: item.food_image,
            price: item.food_price,
            description: item.food_desc,
            category: item.food_category
        }));

        try {
            const response = await axios.get(`${url}/api/food/list`);
            const apiFoodList = response.data.data.map(item => ({
                _id: item._id,
                name: item.name,
                image: `${url}/images/${item.image}`,
                price: item.price,
                description: item.description,
                category: item.category
            }));
            setFoodList([...transformedStaticFoodList, ...apiFoodList]);
        } catch (error) {
            console.error("Failed to fetch food list:", error);
            // Use only static data if API fails
            setFoodList(transformedStaticFoodList);
        }
    }

    useEffect(() => {
        fetchFoodList();
    }, [])

    const addAiFood = (foodItem) => {
        setAiFoodList(prev => {
            if (!prev.find(item => item._id === foodItem._id)) {
                return [...prev, foodItem];
            }
            return prev;
        });
    };

    const addToCart = (itemId) => {
        setCartItems((prev) => {
            if (!prev[itemId]) {
                return { ...prev, [itemId]: 1 };
            } else {
                return { ...prev, [itemId]: prev[itemId] + 1 };
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            if (!prev[itemId] || prev[itemId] <= 1) {
                const updatedCart = { ...prev };
                delete updatedCart[itemId];
                return updatedCart;
            } else {
                return { ...prev, [itemId]: prev[itemId] - 1 };
            }
        });
    };

    const fetchUserOrders = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await axios.post(`${url}/api/order/userorders`, {}, {
                headers: {
                    token: token
                }
            });
            if (response.data.success) {
                setUserOrders(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch user orders:", error);
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            let itemInfo = food_list.find((food) => food._id === item);
            if (!itemInfo) {
                itemInfo = aiFoodList.find((food) => food._id === item);
            }
            if (itemInfo) {
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    };

    const placeOrder = async (deliveryData) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to place order");
            return;
        }

        setOrderStatus('placing');

        try {
            // Prepare order items
            const orderItems = [];
            for (const itemId in cartItems) {
                let itemInfo = food_list.find((food) => food._id === itemId);
                if (!itemInfo) {
                    itemInfo = aiFoodList.find((food) => food._id === itemId);
                }
                if (itemInfo && cartItems[itemId] > 0) {
                    orderItems.push({
                        _id: itemId,
                        name: itemInfo.name,
                        price: itemInfo.price,
                        quantity: cartItems[itemId]
                    });
                }
            }

            const orderData = {
                userId: "", // Will be set by backend from token
                items: orderItems,
                amount: getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 5),
                address: deliveryData
            };

            const response = await axios.post(`${url}/api/order/placecod`, orderData, {
                headers: {
                    token: token
                }
            });

            if (response.data.success) {
                setCartItems({}); // Clear cart
                setOrderStatus('success');
                // Reset status after a delay
                setTimeout(() => setOrderStatus(null), 3000);
            } else {
                setOrderStatus('error');
                alert(response.data.message || "Failed to place order");
                setTimeout(() => setOrderStatus(null), 3000);
            }
        } catch (error) {
            console.error("Failed to place order:", error);
            setOrderStatus('error');
            alert("Failed to place order. Please try again.");
            setTimeout(() => setOrderStatus(null), 3000);
        }
    };

    const contextValue = {
        food_list,
        aiFoodList,
        menu_list,
        cartItems,
        addToCart,
        addAiFood,
        removeFromCart,
        getTotalCartAmount,
        placeOrder,
        orderStatus,
        fetchUserOrders,
        userOrders
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    )

}

StoreContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default StoreContextProvider;