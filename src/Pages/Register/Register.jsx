import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import LandingNav from "../LandingPage/LandingNav"
import "./Register.css"
export default function Register() {
  return (
    <>
    <LandingNav/>
    <div className="register-container">
    <img src="assets/register.png" alt="" />
    <div style={{paddingTop:'20px',margin:'10px',marginLeft:'40px'}}>
    <div className="title" style={{textAlign:'center'}}>Register</div>
    <div className="register-inputs">

    <div class="form">
  <input type="text" name="text" autocomplete="off" required />
  <label for="text" class="label-name">
    <span class="content-name">
      Enter First Name
    </span>
  </label>
</div>
<div class="form">
  <input type="text" name="text" autocomplete="off" required />
  <label for="text" class="label-name">
    <span class="content-name">
      Enter Last Name
    </span>
  </label>
</div>
<div class="form">
  <input type="text" name="text" autocomplete="off" required />
  <label for="text" class="label-name">
    <span class="content-name">
      Enter Email
    </span>
  </label>
</div>
<div class="form">
  <input type="text" name="text" autocomplete="off" required />
  <label for="text" class="label-name">
    <span class="content-name">
      Enter Phone Number
    </span>
  </label>
</div>
<div class="form">
  <input type="text" name="text" autocomplete="off" required />
  <label for="text" class="label-name">
    <span class="content-name">
      Enter Password
    </span>
  </label>
</div>
<div class="form">
  <input type="text" name="text" autocomplete="off" required />
  <label for="text" class="label-name">
    <span class="content-name">
      Enter Confirm Password
    </span>
  </label>
</div>
    </div>
<div className="form-button" style={{marginLeft:'30px'}}>
<button type="button" class="loginbtn">Register</button>
<button type="button" class="cancelbtn"><Link to={"/"}>Cancel</Link></button>
</div>
<div className="register-section" style={{justifyContent:'center'}}>
<span>Already a member?</span> <Link to={"/login"}>Login</Link>
</div>
</div>
    </div>
    </>
  )
}
