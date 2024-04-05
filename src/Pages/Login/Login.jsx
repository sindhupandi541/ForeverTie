import React,{ useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import LandingNav from "../LandingPage/LandingNav"
import "./Login.css"
export default function Login() {
  const [values, setValues] = useState({
    Email: '',
    Password: ''
});

const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
};
function handleOnClick() {
  console.log(values);
  
}
  return (
    <>
    <LandingNav/>
    <div className="login-container">
        <img src="assets/login.png" alt="" />
<div style={{paddingTop:'20px',justifyContent:'center'}}>
    <div className="title" style={{textAlign:'center'}}>Login</div>
    <div class="form">
  <input type="email" name="Email" autocomplete="off" value={values.Email} onChange={handleChange} required />
  <label for="Email" class="label-name">
    <span class="content-name">
      Enter Email
    </span>
  </label>
</div>
<div class="form">
  <input type="password" name="Password" value={values.Password} onChange={handleChange} autocomplete="off" required />
  <label for="Password" class="label-name">
    <span class="content-name">
      Enter Password
    </span>
  </label>
</div>
<div className="form-button">
<button type="button" class="loginbtn" onClick={handleOnClick}>Login</button>
<button type="button" class="cancelbtn"><Link to={"/"}>Cancel</Link></button>
</div>
<div className="register-section" style={{marginLeft:'20%'}}>
<span>Not a member?</span> <Link to={"/register"}>Register</Link>
</div>
</div>
    </div>
    </>
  )
}
