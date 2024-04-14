import React from 'react';
import LandingNav from '../LandingPage/LandingNav';
import "./Home.css"
import Services from './Services';
// import ImageUploader from '../../Components/ImageUploader/ImageUploader'

export default function Home() {

  return (
    <>
      <LandingNav userLoggedIn="customer" />
      <Services />
      {/* <ImageUploader /> */}

    </>
  );
}
