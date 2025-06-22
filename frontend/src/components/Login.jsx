import React, { useState } from 'react'
import {useNavigate}  from "react-router-dom"
import "./login.css"
export default function Login() {
    const navigator=useNavigate();
    const [errMsg,setErrMsg]=useState("")
    const [phone,setPhone]=useState('')
    const handleSubmit=(e)=>{
      e.preventDefault();
      fetch("https://tic-tac-toe-xu3n.onrender.com/login",{
         method:"post",
        credentials:"include",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
          phone:e.target.phoneInput.value,
          password:e.target.passwordInput.value
        })
      })
      .then((res)=>{
        if(res.ok){
          navigator("/home");
        }
        else{
          throw new Error("Unauthorized");
        }
      })
      .catch((err)=>{
        console.log("error while login",err)
      })
    }
    const handleBack=()=>{
      navigator('/')
    }
  return (
    <div>
      {errMsg && <p className="error-message">{errMsg}</p>}
      <form name="loginForm" id="loginForm" onSubmit={handleSubmit}>
        <label htmlFor="phoneInput" name="phoneLabel">Phone:</label>
        <input type="text" id="phoneInput" name="phone" />

        <label htmlFor="passwordInput" name="passwordLabel">Password:</label>
        <input type="password" id="passwordInput" name="password" />

        <button type="submit" name="submitBtn">Login</button>
      </form>
      <button type="button" onClick={handleBack} className='back'>Back</button>
    </div>
  )
}
