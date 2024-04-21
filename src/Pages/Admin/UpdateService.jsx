import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScaleLoader from "react-spinners/ScaleLoader";
import axios from 'axios';
import { AiTwotoneEdit , AiOutlineArrowLeft } from "react-icons/ai";
import LandingNav from '../LandingPage/LandingNav';
import ImageUploader from '../../Components/ImageUploader/ImageUploader'
import swal from 'sweetalert';

export default function UpdateService() {
    let navigate = useNavigate();
    const { id } = useParams();
    const [images, setImages] = useState([]);
    const [initialValues,setinitialValues] = useState({
        name: '',
        address: '',
        rate: '',
        capacity: '',
        category: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [values, setValues] = useState({
        name: '',
        address: '',
        rate: '',
        capacity: '',
        category: ''
    });

    useEffect(() => {
        setTimeout(() => {
            loadImages();
        }, 2000);
        
    }, [id]);

    const loadImages = async () => {
        try {
            const res = await axios.get('https://server-tjm9.onrender.com/getUpdatingService', { params: { id: id } });
            let data = res.data.Result;
            setinitialValues(data.services[0])
            setValues(data.services[0]);
            let imagesdata=[];
            data.service_images.forEach(element => {
                imagesdata.push(element.image_data);
            });
            setImages(imagesdata);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    // function handleAddService() {
    //     const hasChanged = Object.entries(values).some(([key, value]) => {
    //         return value !== initialValues[key];
    //     });
    //     if(hasChanged){

    //     }
    // }

    function handleAddService() {
    
        const hasChanged = Object.entries(values).some(([key, value]) => {
            return value !== initialValues[key];
        });
    
        if (hasChanged) {
            setIsLoading(true);
    
            setTimeout(() => {
                axios.put('https://server-tjm9.onrender.com/updateService', values)
                    .then(response => {
                        console.log('Service updated successfully:', response.data);
                        swal({
                            title: 'Success',
                            text: 'Service updated successfully',
                            icon: "success",
                        });
                        setIsLoading(false); 
                        navigate(-1)
                    })
                    .catch(error => {
                        console.error('Error updating service:', error);
                        swal({
                            title: 'Error',
                            text: 'An error occurred while updating the service',
                            icon: "error",
                        });
                        setIsLoading(false); // Set loading state to false if there's an error
                    });
            }, 2000); // Set timeout for 2 seconds
        } else {
            swal("No Changes", "No changes have been made to update", "info");
        }
    }
    
    

    return (
        <>
        <LandingNav userLoggedIn='admin'/>
            {isLoading === true && (
                <div className="spinner-overlay">
                    <div className="spinner-container">
                        <ScaleLoader color="#e72e77" />
                    </div>
                </div>
            )}
            <div className="addService-outer-container">
                <div className="add-service-title">Enter Service details</div>

                <div className="addService-inner-container">
                    <div className="form">
                        <input type="text" name="name" autoComplete="off" required onChange={handleChange} value={values.name} />
                        <label htmlFor="name" className="label-name">
                            <span className="content-name">Enter Service Name</span>
                        </label>
                    </div>
                    <div className="form">
                        <input type="text" name="address" autoComplete="off" required onChange={handleChange} value={values.address} />
                        <label htmlFor="address" className="label-name">
                            <span className="content-name">Enter Address</span>
                        </label>
                    </div>
                    <div className="form">
                        <input type="number" name="capacity" autoComplete="off" required onChange={handleChange} value={values.capacity} />
                        <label htmlFor="capacity" className="label-name">
                            <span className="content-name">Enter Service Capacity</span>
                        </label>
                    </div>
                    <div className="form">
                        <input type="number" name="rate" autoComplete="off" required onChange={handleChange} value={values.rate} />
                        <label htmlFor="rate" className="label-name">
                            <span className="content-name">Enter Service Rate</span>
                        </label>
                    </div>
                    <div className="reserve-button" onClick={() => navigate(-1)} style={{ marginTop: '20px', marginLeft: '50%' }}>
                        <AiOutlineArrowLeft fill='white' fontSize='large' />
                        <button type="button" >Back</button>
                    </div>
                    <div className="reserve-button" style={{ marginTop: '20px' }} onClick={handleAddService}>
                        <button type="button" >Update</button>
                        <AiTwotoneEdit  fill='white' fontSize='larger' />
                    </div>
                </div>
                <ImageUploader service_id={values.id} imageslist={images}/>
            </div>
        </>
    )
}
