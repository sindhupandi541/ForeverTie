import React, { useState, useEffect } from 'react';
import './Slider.css';

export default function ImageSlider() {
  const slides = [
    {
      id: 1,
      imageUrl: 'assets/wedding-image1.jpg',
      title: 'Welcome to Timeless Memories, Tech Romance',
      text: 'Love blooms, pixels dance',
    },
    {
      id: 2,
      imageUrl: 'assets/wedding-image2.jpg',
      title: 'Welcome to Luxury Elegance, Virtual Grandeur',
      text: 'Sophistication reigns, bytes dazzle',
    },
    {
      id: 3,
      imageUrl: 'assets/wedding-image3.jpg',
      title: 'Welcome to Tailored Perfection, Personal Touch',
      text: 'Your love story, digitized',
    },
   ];
  

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((currentSlide + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  return (
    <div className="slider">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? 'active' :'hide'}`}
        >
          <div
            className="image-container"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          ></div>
            <div className="greeting-message">
            <span className="greet-title">{slide.title}</span>
        <span className="greet-message">{slide.text}</span>
            {/* <p dangerouslySetInnerHTML={{ __html: slide.text }}></p> */}
            </div>

        </div>
      ))}
    </div>
  );
};
