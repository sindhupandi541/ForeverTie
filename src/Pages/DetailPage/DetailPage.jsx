import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ScaleLoader from "react-spinners/ScaleLoader";
import LandingNav from '../LandingPage/LandingNav';
import { AiFillEdit, AiOutlineArrowLeft,AiOutlineSchedule } from "react-icons/ai";
import './DetailPage.css';

export default function DetailPage() {
  let navigate = useNavigate();
  const { serviceId } = useParams();
  const [serviceDetails, setServiceDetails] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Index of the selected image
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setTimeout(async () => { // Set timeout for 1 second delay
          const res = await axios.get(`http://localhost:8081/ServiceDetails/${serviceId}`);
          const data = res.data;
          setServiceDetails(data);
          setMainImage(data.images[0]);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchServiceDetails();
  }, [serviceId]);
  

  const handleImageClick = (image, index) => {
    setMainImage(image);
    setSelectedImageIndex(index); // Set the index of the selected image
  };

  const handleReserve = async () => {
    console.log('handleReserve clicked');
    try {
      const userId = window.sessionStorage.getItem('UserId');
      const serviceId = serviceDetails.serviceDetails.id;


      const res = await axios.post('http://localhost:8081/checkCartItem', {
        userId,
        serviceId,
      });
      
      if (res.data.exists) {
        navigate('/cart')
        return
      }
      await axios.post('http://localhost:8081/addToCart', {
        userId,
        serviceId,
        price: serviceDetails.serviceDetails.rate,
        totalPrice: serviceDetails.serviceDetails.rate
      });
      
      navigate('/cart');
    } catch (error) {
      console.error('Error adding service to cart:', error);
    }
  };

  return (
    <>
      <LandingNav userLoggedIn="customer" />
      {isLoading ? (
        <div className="spinner-overlay">
          <div className="spinner-container">
            <ScaleLoader color="#e72e77" />
          </div>
        </div>
      ) : (
        <div className="detail-page-container">
          <div className="detail-heading">
            <h2>{serviceDetails.serviceDetails.category} Details</h2>
          </div>
          <div className="main-container">
            <div className="main-image-container">
              <h3>Service Gallery</h3>
              <img src={`data:image/png;base64,${mainImage.image_data}`} alt="Main" />
            </div>
            <div className="service-info">
              <p><strong>Name:</strong> {serviceDetails.serviceDetails.name}</p>
              <p><strong>Address:</strong> {serviceDetails.serviceDetails.address}</p>
              <p><strong>Capacity:</strong> {serviceDetails.serviceDetails.capacity}</p>
              <p><strong>
                {serviceDetails.serviceDetails.category === 'cater' ? 'Rate Per Person' :
                  serviceDetails.serviceDetails.category === 'decor' ? 'Rate Per Event' :
                    'Rate Per Hour'} :</strong> ${serviceDetails.serviceDetails.rate}</p>
              <div className="buttons-group">
                <div className="reserve-button" onClick={() => navigate(-1)}>
                  <AiOutlineArrowLeft fill='white' fontSize='large' />
                  <button type="button" >Back</button>
                </div>
                {window.sessionStorage.getItem('UserType') === 'customer' && (
                <div className="reserve-button" onClick={handleReserve}>
                  <AiOutlineSchedule fill='white' fontSize='xx-large' />
                  <button type="button" >Reserve</button>
                </div>
                )}
                {window.sessionStorage.getItem('UserType') === 'admin' && (
                <div className="reserve-button" onClick={() => navigate(`/updateService/${serviceDetails.serviceDetails.id}`)}>
                  <AiFillEdit fill='white' fontSize='xx-large' />
                  <button type="button" >Edit</button>
                </div>
                )}
              </div>
            </div>
          </div>
          <div className="image-grid">
            {serviceDetails.images.map((image, index) => (
              <img key={index} src={`data:image/png;base64,${image.image_data}`} alt={`${index}`} 
                   onClick={() => handleImageClick(image, index)} 
                   className={selectedImageIndex === index ? 'selected-image' : ''} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
