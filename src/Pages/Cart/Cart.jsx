import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScaleLoader from "react-spinners/ScaleLoader";
import LandingNav from '../LandingPage/LandingNav';
import "./Cart.css";
import { AiFillDelete, AiOutlineArrowRight, AiOutlineHistory, AiFillHome } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate('');
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = window.sessionStorage.getItem('UserId');

  const delay = 1500;
  useEffect(() => {
    fetchCartItems();
  }, [userId]);
  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      if (userId) {
        setTimeout(async () => {
          const res = await axios.post('http://localhost:8081/getCart', { userId: userId });
          // console.log(res.data);
          setCartItems(res.data);
          setIsLoading(false);
        }, delay);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  const handleDeleteItem = async (itemId) => {
    try {
      await axios.post('http://localhost:8081/deleteCartItem', { userId: userId, itemId: itemId });
      fetchCartItems();
    } catch (error) {
      console.error('Error deleting item from cart:', error);
    }
  };
  const handleCheckout = () => {
    if (cartItems.length) {
      navigate('/Checkout');
    }
    else
      setCartItems(prev => ({
        ...prev,
        status: 'Empty',
        message: 'Cart is empty. <br/> Checkout is not possible.'
      }));
  };
  return (
    <>
      <LandingNav userLoggedIn="customer" />
      <div className="cart-container">
        {isLoading ? (
          <div className="spinner-overlay">
            <div className="spinner-container">
              <ScaleLoader color="#e72e77" />
            </div>
          </div>
        ) : (<>
          <div className="cart-header">
            <h2>Cart</h2>
            <div className="cart-buttons-group">
              <div className="reserve-button" onClick={handleCheckout}>
                <button type="button">CheckOut</button>
                <AiOutlineArrowRight fill='white' fontSize='large' className='reserve-button-icon' />
              </div>
              <div className="reserve-button" onClick={() => { navigate('/PaymentHistory') }}>
                <AiOutlineHistory fill='white' fontSize='xx-large' />
                <button type="button" >Payments</button>
              </div>
            </div>
          </div>
          {cartItems.status === "Empty" ? (
            <>
              <p className='Empty-cart-message' dangerouslySetInnerHTML={{ __html: cartItems.message }}></p>
            </>
          ) : (
            <div className="cart-outer-container">
              {cartItems.map((ele, index) => (
                <div className="cart-item" key={index}>
                  <div className="item-image">
                    <img src={`data:image/png;base64,${ele.ServiceImage}`} alt={`${index}`} />
                  </div>
                  <div className="item-details">
                    <div className="item-details-list">
                      <span>Name</span>
                      <span>Rate per Person</span>
                      <span>Category</span>
                      <span>Total Price</span>
                    </div>
                    <div className="item-details-list">
                      <span>{ele.serviceName}</span>
                      <span>{ele.serviceRate}</span>
                      <span>{ele.ServiceCategory}</span>
                      <span>{ele.TotalPrice}</span>
                    </div>
                  </div>
                  <AiFillDelete fill='#e72e77' fontSize='x-large' cursor='pointer' onClick={() => handleDeleteItem(ele.CartId)} className='delete-icon' />
                </div>
              ))}
            </div>
          )}

        </>
        )}
        {isLoading === false && (

              <div className="reserve-button" onClick={() => { navigate('/home') }} style={{ margin: '20px auto'}}>
                <AiFillHome fill='white' fontSize='large' className='reserve-button-icon' />
                <button type="button">Back to Home</button>
              </div>
        )}
      </div>
    </>
  );
}
