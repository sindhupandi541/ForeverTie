import React from 'react'
import LandingNav from './LandingNav'
import "./LandingPage.css"
import ImageSlider from './ImageSlider'
export default function LandingPage() {
  const Categorieslist=[{
    CategoryName: 'Venues',color:'#d8dffc',image:'assets/card5.png'
  },
  {
    CategoryName: 'Decorer',color:'#f6b896',image:'assets/card4.png'
  },
  {
    CategoryName: 'Caterer',color:'#dfb2ad',image:'assets/caterer.png'
  }]
  return (
  <>
    <LandingNav/>
    <ImageSlider/>
    <div className='Outer-Container'>
      <div className="about">
      <span className='title'>ForeverTie - Your Premier E-Wedding Destination Scheduler</span>
      <span className='about-content' >We believe in celebrating love.</span>
      <span className='about-content'>Venue.Caterer.Decor.Arrangements.Destination Wedding. Plan ahead.Seamless transaction.Hessle-free celebration.</span>
      <span className='about-content'>We believe that every love story deserves to be celebrated with grace, elegance, and authenticity, regardless of the distance or circumstances. Join us in embracing the future of weddings, where innovation meets tradition, and love knows no bounds.</span>
      </div>
<div className="categories">
  <h2>Available Facilities</h2>
  <div className="categories-inner-container">
  {Categorieslist.map((category, index) => (
    <div className="category-item" key={index} style={{ backgroundColor: category.color }}>
      <span>{category.CategoryName}</span>
      <img src={category.image} alt="" />
    </div>
  ))}
</div>
  

</div>
      {/* <div className="cards">
      <img className="card-item" src="assets/card2.png" alt="" />
      <img className="card-item" src="assets/card3.jpg" alt="" />
      <img className="card-item" src="assets/card4.png" alt="" />
      <img className="card-item" src="assets/card5.png" alt="" />
      </div> */}
    </div>
  </>
  )
}
