import React, { useState } from 'react';
import { Link ,useNavigate} from "react-router-dom";
import LandingNav from "../LandingPage/LandingNav";
import Auth from './Auth';
import "./Register.css";
import axios from 'axios';
import swal from 'sweetalert';
export default function Register() {
  const navigate = useNavigate('');

  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: '',
    Password: '',
    ConfirmPassword: '',
    UserType: 'customer'
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleRegister = () => {
    const validationErrors = Auth(values);
    setErrors(validationErrors);

    const hasNoErrors = Object.keys(validationErrors).length === 0;
    if (hasNoErrors) {
      delete values.ConfirmPassword;
      console.log(values);
      axios.post('http://localhost:8081/register', values)
  .then(response => {
    console.log(response.data);
    swal({
      title: 'Yaay!',
      text: response.data.message,
      icon: "success",
    }).then(result=>{navigate('/login')})
  })
  .catch(error => {
    if (error.response && error.response.status === 400 && error.response.data.error === "Email already exists") {
      // Handle the case where the email already exists
      swal({
        title: 'Email already exists',
        text: 'Email already exists. Please use a different email address.',
        icon: "error",
      })
      
      // console.log("Email already exists. Please use a different email address.");
    } else {
      console.error(error);
    }
  });

    }
    
  };

  return (
    <>
      <LandingNav />
      <div className="register-container">
        <img src="assets/register.png" alt="" />
        <div style={{ paddingTop: '20px', margin: '10px', marginLeft: '40px' }}>
          <div className="title" style={{ textAlign: 'center' }}>Register</div>
          <div className="register-inputs">
            <div className="form">
              <input type="text" name="FirstName" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="FirstName" className="label-name">
                <span className="content-name">Enter First Name</span>
              </label>
            </div>
            <div className="form">
              <input type="text" name="LastName" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="LastName" className="label-name">
                <span className="content-name">Enter Last Name</span>
              </label>
            </div>
            <div className="form">
              <input type="text" name="Email" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="Email" className="label-name">
                <span className="content-name">Enter Email</span>
              </label>
            </div>
            <div className="form">
              <input type="number" name="PhoneNumber" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="PhoneNumber" className="label-name">
                <span className="content-name">Enter Phone Number</span>
              </label>
            </div>
            <div className="form">
              <input type="password" name="Password" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="Password" className="label-name">
                <span className="content-name">Enter Password</span>
              </label>
            </div>
            <div className="form">
              <input type="password" name="ConfirmPassword" autoComplete="off" required onChange={handleChange} />
              <label htmlFor="ConfirmPassword" className="label-name">
                <span className="content-name">Enter Confirm Password</span>
              </label>
            </div>
          </div>
          <div className="error-container" style={{ marginTop: '20px', textAlign: 'center' }}>
            {Object.values(errors).map((error, index) => (
              <div key={index} className="error-message">{error}</div>
            ))}
          </div>
          <div className="form-button" style={{ marginLeft: '30px' }}>
            <button type="button" className="loginbtn" onClick={handleRegister}>Register</button>
            <button type="button" className="cancelbtn"><Link to={"/"}>Cancel</Link></button>
          </div>
          <div className="register-section" style={{ justifyContent: 'center' }}>
            <span>Already a member?</span> <Link to={"/login"}>Login</Link>
          </div>
        </div>
      </div>
    </>
  );
}
