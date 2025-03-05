import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './Login.css';
import '../../App.css';
import video from '../../LoginAssets/login.mp4';
import logo from '../../LoginAssets/logotr.png';
import { FaUserShield } from "react-icons/fa6";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await Axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token); // Store token
        navigate('/dashboard');
      } else {
        alert(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className='loginPage flex'>
      <div className='container flex'>
        <div className='videoDiv'>
          <video src={video} autoPlay muted loop></video>
          <div className='textDiv'>
            <h2 className='title'>Smarter Skies, Greener Growth</h2>
            <p>Elevating Precision Agriculture into new heights!</p>
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
            <img src={logo} alt='logo' />
            <h3>Welcome Back!</h3>
          </div>

          <form className='form grid'>
            <span>Enter your credentials to Log In</span>
            <div className='inputDiv'>
              <label htmlFor='username'>Username</label>
              <div className='input flex'>
                <FaUserShield className='icon' />
                <input type='text' id='username' placeholder='Username' onChange={(event) => setUsername(event.target.value)} required />
              </div>
            </div>

            <div className='inputDiv'>
              <label htmlFor='password'>Password</label>
              <div className='input flex'>
                <BsFillShieldLockFill className='icon' />
                <input type='password' id='password' placeholder='Password' onChange={(event) => setPassword(event.target.value)} required />
              </div>
            </div>

            <button type='button' className='btn flex' onClick={handleLogin}>
              <span>Login</span>
              <AiOutlineSwapRight className='icon' />
            </button>

            <span className='forgotPassword'>
              Forgot your password? <a href='#'>Click Here</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
