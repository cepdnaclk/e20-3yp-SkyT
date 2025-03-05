import React from 'react'
import './Body.css'
import '../Dashboard.css'
import Top from './Top Section/Top'
import Listing from './Listing Section/Listing'
import Activity from './Activity Section/Activity'
const Body = () => {
  return (
    <div className='mainContent'>
      <Top />
      <div className="bottom flex">
        <Listing />
      </div>

      <div className="bottom flex">
        <Activity />
      </div>
    </div>
  )
}

export default Body
