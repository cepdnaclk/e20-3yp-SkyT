import React,{useState}from 'react'
import './Register.css'
import '../../App.css'

import video from '../../LoginAssets/login.mp4'
import logo from '../../LoginAssets/logotr.png'
import { FaUserShield } from "react-icons/fa6"
import { BsFillShieldLockFill } from "react-icons/bs"
import { AiOutlineSwapRight } from "react-icons/ai";
import { MdMarkEmailUnread } from "react-icons/md";
import {Link} from 'react-router-dom'
import Axios from 'axios'

const Register = () => {
  //usesatates for input
  const [email,setEmail]=useState('')
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')

  //onclick for submit
  const createUser=()=>{
      Axios.post('http://localhost:5000/register',{
        email:email,
        username:username,
        password:password
      }).then(()=>{
        alert('User created')
      })
  }
  return (
    <div className='registerPage flex'>
      <div className='container flex'>
          <div className='videoDiv'>
            <video src={video} autoPlay muted loop></video>

              <div className='textDiv'>
                <h2 className='title'>Smarter Skies, Greener Growth</h2>
                <p className=''>Elevating Precision Agriculture into new heights!</p>
              </div>

              <div className='footerDiv flex'>
                <span className='text'>Already have an account?</span>
                <Link to={'/'}>
                  <button className='btn'>Log In</button>
                </Link>
              </div>
          </div>

          <div className='formDiv flex'>
            <div className='headerDiv'>
              <img src={logo} alt='logo'/>
              <h3>Let us know You!</h3>
              
            </div>
            
            <form action="" className='form grid'>
            {/* <span className=''>Enter your credentials to Log In</span> */}
            <div className='inputDiv'>
                <label htmlFor='email'>Email</label>

                <div className="input flex">
                  <MdMarkEmailUnread className="icon" />
                  <input type="email" id='email' placeholder='Email' onChange={(event)=>setEmail(event.target.value)}/>
                </div>
              </div>
              <div className='inputDiv'>
                <label htmlFor='username'>Username</label>

                <div className="input flex">
                  <FaUserShield className="icon" />
                  <input type="text" id='username' placeholder='Username' onChange={(event)=>setUsername(event.target.value)}/>
                </div>
              </div>

              <div className='inputDiv'>
                <label htmlFor='password'>Password</label>

                <div className="input flex">
                  <BsFillShieldLockFill className="icon" />
                  <input type="password" id='Password' placeholder='Password' onChange={(event)=>setPassword(event.target.value)}/>
                </div>
              </div>

              <button type='submit' className='btn flex' onClick={createUser}>
                <span>Sign Up </span>
                <AiOutlineSwapRight className='icon'/>
              </button>

            </form>

          </div>
      </div>
    </div>
  )
}

export default Register
