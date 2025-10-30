
import { useState, useEffect } from 'react';
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Failed to fetch food list");
      console.error(error);
    }
  }

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId
      });
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Failed to remove food item");
      console.error(error);
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list'>
      <p>All Foods List</p>
      <div className='list-table'>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-item'>
              <div className='list-item-img-container'>
                <img className='list-item-image' src={`${url}/images/` + item.image} alt="" />
              </div>
              <div className="list-item-info">
                <p className="list-item-name">{item.name}</p>
                <p className="list-item-category">{item.category}</p>
                <p className="list-item-price">{currency}{item.price}</p>
                <button className='list-item-action' onClick={() => removeFood(item._id)}>Remove</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
