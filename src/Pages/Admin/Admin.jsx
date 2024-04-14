import React from 'react';
import LandingNav from '../LandingPage/LandingNav';
import Services from '../Home/Services'
import './Admin.css'
export default function Admin() {
  return (
    <>
    <LandingNav userLoggedIn='admin'/>
    <Services/>
    </>
  )
}
