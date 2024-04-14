import React from 'react'
import LandingNav from '../LandingPage/LandingNav';
import Services from './Services';
export default function Venue() {
  return (
    <>
    <LandingNav userLoggedIn="customer" />
      <Services category='venue'/>
    </>
  )
}
