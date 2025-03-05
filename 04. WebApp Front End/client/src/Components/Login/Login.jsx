import React, {useState} from 'react'
import './Login.css'
import '../../App.css'

import video from '../../LoginAssets/login.mp4'
import logo from '../../LoginAssets/logotr.png'
import { FaUserShield } from "react-icons/fa6"
import { BsFillShieldLockFill } from "react-icons/bs"
import { AiOutlineSwapRight } from "react-icons/ai";
import {Link} from 'react-router-dom'

const Login = () => {
  const [username,loginUsername]=useState('')
  const [password,loginPassword]=useState('')
  const readUser=()=>{
    Axios.post('http://localhost:5000/login',{
      loginUsername:username,
      loginPassword:password
    }).then(()=>{
      console.log(response)
    })
}
  return (
    <div className='loginPage flex'>
      <div className='container flex'>
          <div className='videoDiv'>
            <video src={video} autoPlay muted loop></video>

              <div className='textDiv'>
                <h2 className='title'>Smarter Skies, Greener Growth</h2>
                <p className=''>Elevating Precision Agriculture into new heights!</p>
              </div>

              <div className='footerDiv flex'>
                <span className='text'>Don't have an account?</span>
                <Link to={'/register'}>
                  <button className='btn'>Sign Up</button>
                </Link>
              </div>
          </div>

          <div className='formDiv flex'>
            <div className='headerDiv'>
              <img src={logo} alt='logo'/>
              <h3>Welcome Back!</h3>
              
            </div>
            
            <form action="" className='form grid'>
            <span className=''>Enter your credentials to Log In</span>
              <div className='inputDiv'>
                <label htmlFor='username'>Username</label>

                <div className="input flex">
                  <FaUserShield className="icon" />
                  <input type="text" id='username' placeholder='Username'onChange={(event)=>loginUsername(event.target.value)}/>
                </div>
              </div>

              <div className='inputDiv'>
                <label htmlFor='password'>Password</label>

                <div className="input flex">
                  <BsFillShieldLockFill className="icon" />
                  <input type="password" id='password' placeholder='Password' onChange={(event)=>loginPassword(event.target.value)}/>
                </div>
              </div>

              <button type='submit' className='btn flex'>
                <span>Login </span>
                <AiOutlineSwapRight className='icon'/>
              </button>

              <span className='forgotPassword'>
                Forgot your password? <a href="">Click Here</a>
              </span>
            </form>

          </div>
      </div>
    </div>
  )
}

export default Login
