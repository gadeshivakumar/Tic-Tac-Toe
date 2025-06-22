import {React,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import "./register.css"
export default function Register() {
    const navigator=useNavigate();
    const [errMsg,setErrMsg]=useState("")
     const handleBack=()=>{
      navigator('/')
    }

    function handleSubmit(e){
      e.preventDefault();
      fetch('https://tic-tac-toe-xu3n.onrender.com/register',{
        method:"post",
        credentials:"include",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
          name:e.target.usernameInput.value,
          phone:e.target.phoneInput.value,
          password:e.target.passwordInput.value
        })
      })
      .then(()=>{
        console.log("Registered")
        navigator('/login');
      })
      .catch(()=>{
        console.log("error")
      })
    }
  return (
    <div>
         {/* {errMsg && <p className="error-message">{errMsg}</p>} */}
     <form name="registerForm" id="registerForm" onSubmit={handleSubmit}>
        <label htmlFor="usernameInput" name="usernameLabel">Username:</label>
        <input type="text" id="usernameInput" name="username" />

        <label htmlFor="passwordInput" name="passwordLabel">Password:</label>
        <input type="password" id="passwordInput" name="password" />

        <label htmlFor="phoneInput" name="phoneLabel">Phone:</label>
        <input type="text" id="phoneInput" name="phno" />

        <button type="submit" name="submitBtn">Register</button>
      </form>
     <button type="button" onClick={handleBack} className="back" >Back</button>
    </div>
  )
}
