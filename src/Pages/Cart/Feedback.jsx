import React, { useState, useEffect } from 'react';
import LandingNav from '../LandingPage/LandingNav';
import './Feedback.css';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

export default function Feedback() {
    const [Feedback, setFeedback] = useState('');
    const navigate = useNavigate('');
    const handleInputChange = (e) => {
        setFeedback(e.target.value);
    };
    function handleSubmit() {
        if(Feedback === '')
        {
            swal({
                title:'Invalid Feedback',
                text:'Please provide the Feedback',
                icon:'error'
            })
        }
        else{
            swal({
                title:'Success',
                text:'Feedback submitted successfully',
                icon:'success'
            }).then(ok=>{
                if(ok){
                    navigate('/home');
                }
            })
        }
        
    }
  return (
    <>
    <LandingNav userLoggedIn="customer"/>
    <div className="feedback-container">
        <div className="title">Feedback</div>
        <textarea name="Feedback" id="" cols="30" rows="10" className='feed-back-input' onChange={handleInputChange}></textarea>
        <div className="reserve-button" onClick={() => { handleSubmit() }} style={{ margin: '20px auto'}}>
                {/* <AiFillHome fill='white' fontSize='large' className='reserve-button-icon' /> */}
                <button type="button">submit</button>
              </div>    </div>
    </>
  )
}
