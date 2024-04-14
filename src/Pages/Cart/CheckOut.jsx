import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css'
import LandingNav from '../LandingPage/LandingNav';
import ScaleLoader from "react-spinners/ScaleLoader";
import { useNavigate } from 'react-router-dom';
import { AiFillHome, AiOutlineCreditCard ,AiOutlineArrowLeft } from "react-icons/ai";
import swal from 'sweetalert';

export default function CheckOut() {
    const delay = 1000;
    // const date = window.sessionStorage.getItem('date');
    const navigate = useNavigate('');
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });
    const [error, seterror] = useState({})
    const userId = window.sessionStorage.getItem('UserId');

    useEffect(() => {
        fetchCartItems();
    }, [userId]);

    const fetchCartItems = async () => {
        setIsLoading(true);
        try {
            if (userId) {
                setTimeout(async () => {
                    const res = await axios.post('http://localhost:8081/getCart', { userId: userId });
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails({ ...cardDetails, [name]: value });
    };

    const handlePayment = async () => {
        let err = {};
        const formattedDate = window.sessionStorage.getItem('date');
        console.log('formattedDate',formattedDate);
        if (cardDetails.cardNumber === '' || cardDetails.cardNumber.length < 15) {
            err.cardNumber = 'Invalid card number';
        }
        
        if (cardDetails.expiryDate === '') {
            err.expiryDate = 'Invalid expiry date';
        }
        
        if (cardDetails.cvv === '' || cardDetails.cvv.length < 2) {
            err.cvv = 'Invalid CVV';
        }
        
        seterror(err);
        
        const hasNoErrors = Object.values(err).every(error => !error);
        
        if (hasNoErrors) {
            try {
                setIsLoading(true);
                for (const item of cartItems) {
                    const res = await axios.post('http://localhost:8081/book', {
                        userId: userId,
                        serviceId: item.ServiceId,
                        totalPayment: item.TotalPrice,
                        paymentMode: 'card',
                        bookingDate: formattedDate,
                        paymentStatus: 'Success'
                    });

                }
                setTimeout(emptyCart, 2000);
                
            } catch (error) {
                console.error('Error inserting booking:', error);
            }
        }
    };
    
    const emptyCart = async () => {
        try {
            const res = await axios.delete(`http://localhost:8081/emptyCart/${userId}`);
            if (res.data.status === 'Success') {
                swal({
                    title: 'Payment Successful',
                    text: 'Your booking is confirmed',
                    icon: "success",
                });
                setIsLoading(false);
                navigate('/cart')
            } else {
                swal({
                    title: 'Error',
                    text: 'Failed to empty cart',
                    icon: "error",
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error emptying cart:', error);
        }
    };
    
    
    
    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.TotalPrice, 0);
    };

    return (
        <>
            <LandingNav userLoggedIn='customer' />
            {isLoading && (
                <div className="spinner-overlay">
                    <div className="spinner-container">
                        <ScaleLoader color="#e72e77" />
                    </div>
                </div>
            )}
            <div className="checkout-container">
                <div className="payment-details">
                    <h2>Enter Card Details:</h2>
                    <div className="form">
                        <input type="number" name="cardNumber" autoComplete="off" required onChange={handleInputChange}/>
                        <label htmlFor="cardNumber" className="label-name">
                            <span className="content-name">Enter Card Number</span>
                        </label>
                    </div>
                    <div className="form">
                        <input type="month" name="expiryDate" autoComplete="off" required onChange={handleInputChange}/>
                        <label htmlFor="expiryDate" className="label-name">
                            <span className="content-name">Enter Expiry Date</span>
                        </label>
                    </div>
                    <div className="form">
                        <input type="password" name="cvv" autoComplete="off" required onChange={handleInputChange}/>
                        <label htmlFor="cvv" className="label-name">
                            <span className="content-name">Enter CVV</span>
                        </label>
                    </div>
                    <div className="amount">
                        <span>Total Amount</span> <span>{calculateTotalPrice()}</span>
                    </div>
                    <div className="error-container" style={{ marginTop: '20px', textAlign: 'center' }}>
            {Object.values(error).map((error, index) => (
              <div key={index} className="error-message">{error}</div>
            ))}
          </div>
                    <div className="reserve-button" onClick={handlePayment} style={{ margin: '20px auto' }}>
                        <AiOutlineCreditCard fill='white' fontSize='large' className='reserve-button-icon' />
                        <button type="button">Pay Now</button>
                    </div>
                </div>
                <div className="cart-details">
                    {cartItems.map((item, index) => (
                        <div key={index} className="checkout-page-item">
                            <div className="checkout-item-image">
                                <img src={`data:image/png;base64,${item.ServiceImage}`} />
                            </div>
                            <div className="item-details">
                                <div className="checkout-details-list">
                                    <span>Name</span>
                                    <span>Category</span>
                                    <span>Total Price</span>
                                </div>
                                <div className="checkout-details-list">
                                    <span>{item.serviceName}</span>
                                    <span>{item.ServiceCategory}</span>
                                    <span>{item.TotalPrice}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="cart-buttons-group">

            <div className="reserve-button" onClick={() => { navigate('/cart') }} style={{ margin: '20px auto' }}>
                <AiOutlineArrowLeft fill='white' fontSize='large' className='reserve-button-icon' />
                <button type="button">Back to Cart</button>
            </div>
            <div className="reserve-button" onClick={() => { navigate('/home') }} style={{ margin: '20px auto' }}>
                <AiFillHome fill='white' fontSize='large' className='reserve-button-icon' />
                <button type="button">Back to Home</button>
            </div>
            </div>
        </>
    )
}
