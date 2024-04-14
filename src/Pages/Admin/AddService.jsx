import React, {useState} from 'react'
import LandingNav from '../LandingPage/LandingNav';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Admin.css";
import { AiOutlinePlus , AiOutlineArrowLeft } from "react-icons/ai";
import swal from 'sweetalert';
import ImageUploader from '../../Components/ImageUploader/ImageUploader'
export default function AddService() {
    const [insertedId, setinsertedId] = useState('');
    const { category } = useParams();
    const [values, setValues] = useState({
        name:'',
        address:'',
        rate:'',
        capacity:0,
        category:category
    });
    let navigate = useNavigate();
    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
      };
      async function handleAddService() {
        const hasNoErrors = Object.values(values).every(value => value !== '');
        if (hasNoErrors) {
            try {
                const res = await axios.post('http://localhost:8081/addService', values);
                console.log(res.data.id);

                setinsertedId(res.data.id);
            } catch (error) {
                swal({
                    title: 'Error adding service',
                    text: error,
                    icon: "error",
                  })
            }
        } else {
            swal({
                title: 'Invalid Details',
                text: 'Please fill in all the fields.',
                icon: "error",
              })
        }
      }
    return (
        <>
            <LandingNav userLoggedIn='admin' />
            <div className="addService-outer-container">
            <div className="add-service-title">Enter {category === 'venue' ? category: category === 'cater' ? category : category === 'decor' ? category : ''} details</div>

                <div className="addService-inner-container">
                <div className="form">
              <input type="text" name="name" autoComplete="off" required onChange={handleChange} value={values.name}/>
              <label htmlFor="name" className="label-name">
                <span className="content-name">Enter Service Name</span>
              </label>
            </div>
            <div className="form">
              <input type="text" name="address" autoComplete="off" required onChange={handleChange} value={values.address}/>
              <label htmlFor="address" className="label-name">
                <span className="content-name">Enter Address</span>
              </label>
            </div>
            <div className="form">
              <input type="number" name="capacity" autoComplete="off" required onChange={handleChange} disabled = {category === 'decor'} value={values.capacity}/>
              <label htmlFor="capacity" className="label-name">
                <span className="content-name">Enter Service Capacity</span>
              </label>
            </div>
            <div className="form">
              <input type="number" name="rate" autoComplete="off" required onChange={handleChange} value={values.rate}/>
              <label htmlFor="rate" className="label-name">
                <span className="content-name">Enter Service Rate</span>
              </label>
            </div>            
                <div className="reserve-button" onClick={() => navigate(-1)} style={{marginTop:'20px',marginLeft:'50%',display: insertedId === '' ? 'block' : 'none'}}>
                  <AiOutlineArrowLeft fill='white' fontSize='large' />
                  <button type="button" >Back</button>
                </div>
                <div className="reserve-button" style={{marginTop:'20px',display: insertedId === '' ? 'block' : 'none'}} onClick={handleAddService}>
                  <button type="button" >Upload Images</button>
                  <AiOutlinePlus  fill='white' fontSize='xx-large' />
                </div>
                </div>
                {insertedId != '' && (<ImageUploader service_id={insertedId}/>)}
            </div>
        </>
    )
}
