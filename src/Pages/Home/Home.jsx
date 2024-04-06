import React, { useState, useEffect } from 'react';
import LandingNav from '../LandingPage/LandingNav';
import ImageUploader from '../../Components/ImageUploader/ImageUploader';
import axios from 'axios';

export default function Home() {
  const [imagesList, setImagesList] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const res = await axios.get('http://localhost:8081/getServiceImages');
        const data = res.data.Result;
        const updatedImages = data.map((ele) => ({
          ...ele,
          image_data: btoa(String.fromCharCode(...ele.image_data.data))
        }));
        setImagesList(updatedImages);
      } catch (err) {
        console.error(err);
      }
    };
    return loadImages(); // Corrected: Call loadImages directly in useEffect
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <>
      <LandingNav userLoggedIn="customer" />
      <ImageUploader />
      <div>
        {imagesList.map((ele, index) => (
          <img key={index} src={`data:image/png;base64,${ele.image_data}`} alt="" />
        ))}
      </div>
    </>
  );
}
