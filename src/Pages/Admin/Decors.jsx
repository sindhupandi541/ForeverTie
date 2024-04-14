import React from 'react'
import LandingNav from '../LandingPage/LandingNav';
import Services from '../Home/Services';
export default function Decors() {
  return (
    <>
    <LandingNav userLoggedIn='admin'/>
    <Services category='decor'/>
    </>
  )
}
