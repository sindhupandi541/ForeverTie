import React from 'react'
import LandingNav from '../LandingPage/LandingNav';
import Services from './Services';
export default function Decorer() {
  return (
    <>
    <LandingNav userLoggedIn="customer" />
      <Services category='decor'/>
    </>
  )
}
