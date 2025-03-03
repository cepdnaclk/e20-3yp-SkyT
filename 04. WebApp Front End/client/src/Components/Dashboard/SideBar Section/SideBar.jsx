import React from 'react'
import '../Dashboard.css'
import './sidebar.css'

//Assets
import logo from '../../../LoginAssets/logotr.png'

//Icons
import { IoSpeedometer } from "react-icons/io5";
import { FaClipboardList } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoAnalyticsSharp } from "react-icons/io5";
import { ImCompass2 } from "react-icons/im";
import { FaUserCircle } from "react-icons/fa";
import { IoPower } from "react-icons/io5";

//routing
import {Link,NavLink} from 'react-router-dom'


const SideBar = () => {
  return (
    <div className='sideBar flex'>
      <div className="logoDiv flex">
        <img src={logo} alt="" className="logo" />
        {/* <h2>Sky T</h2> */}
      </div>

      <div className="menuDiv">
        <h3 className="divTitle">
          Quick Menu
        </h3>
        <ul className="menuLists grid">
          
          <li className="listItem active">
            <a href={Link} className="menuLink flex">
            <IoSpeedometer className='icon'/>
            <span className='smallText'>
              Dashboard
            </span>
            </a>
          </li>
          <li className="listItem">
            <a href="" className="menuLink flex">
            <FaClipboardList className='icon'/>
            <span className='smallText'>
              Events
            </span>
            </a>
          </li>
          <li className="listItem">
            <a href="" className="menuLink flex">
            <IoAnalyticsSharp className='icon'/>
            <span className='smallText'>
              Analytics
            </span>
            </a>
          </li>
          <li className="listItem">
            <a href="" className="menuLink flex">
            <ImCompass2 className='icon'/>
            <span className='smallText'>
              Explore
            </span>
            </a>
          </li>
        </ul>
      </div>

      <div className="settingsDiv">
        <h3 className="divTitle">
          Quick Settings
        </h3>
        <ul className="menuLists grid">
          
          <li className="listItem">
            <a href="" className="menuLink flex">
            <FaUserCircle className='icon'/>
            <span className='smallText'>
              Profile
            </span>
            </a>
          </li>
          <li className="listItem">
            <a href="" className="menuLink flex">
            <IoMdSettings className='icon'/>
            <span className='smallText'>
              Settings
            </span>
            </a>
          </li>
        </ul>
          
          
        
      </div>
      <div className="line"></div>

      <Link to={'/'}>
      <button className='btn flex fullspan'>
        
            <span className='logout'><IoPower className='icon'/> Logout </span>
            
      </button>
      </Link>
      
    </div>
  )
}

export default SideBar
