import React,{ useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

import LandingNav from "../LandingPage/LandingNav"
import "./Login.css"
import swal from 'sweetalert';
export default function Login() {
  const navigate = useNavigate('');
  const [values, setValues] = useState({
    Email: '',
    Password: ''
});

const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
};
function handleOnClick() {
  if (Object.values(values).some(value => value === '')) {
    swal({
  title: "Invalid Credentials",
  text: "Please enter all details",
  icon: "error",
  button: "Enter Credentials",
});
return ;
}
axios.post('http://localhost:8081/login', values)
.then(res => {
  const { status, message,Id } = res.data;
  if (status === 'Error') {
    swal({
      title: message,
      text: 'Click OK to Register',
      icon: "error",
    })
    .then((success) => {
      if (success) {
      navigate('/register');
      }
    });
  } else {
    localStorage.setItem('UserType',status);
    localStorage.setItem('UserId',Id);
    navigate('/home')
  }
})
.catch(error => {
  console.error(error);
});


  
}
  return (
    <>
    <LandingNav/>
    <div className="login-container">
        <img src="assets/login.png" alt="" />
<div style={{paddingTop:'20px',justifyContent:'center'}}>
    <div className="title" style={{textAlign:'center'}}>Login</div>
    <div className="form">
  <input type="email" name="Email" autoComplete="off" value={values.Email} onChange={handleChange} required />
  <label htmlFor="Email" className="label-name">
    <span className="content-name">
      Enter Email
    </span>
  </label>
</div>
<div className="form">
  <input type="password" name="Password" value={values.Password} onChange={handleChange} autoComplete="off" required />
  <label htmlFor="Password" className="label-name">
    <span className="content-name">
      Enter Password
    </span>
  </label>
</div>
<div className="form-button">
<button type="button" className="loginbtn" onClick={handleOnClick}>Login</button>
<button type="button" className="cancelbtn"><Link to={"/"}>Cancel</Link></button>
</div>
<div className="register-section" style={{marginLeft:'20%'}}>
<span>Not a member?</span> <Link to={"/register"}>Register</Link>
</div>
</div>
    </div>
    </>
  )
}
