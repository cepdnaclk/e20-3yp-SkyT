import React from 'react'
import './listing.css'
import SmallCard from '../../../widgets/smallCard'
//Icons
import { LiaTemperatureHighSolid } from "react-icons/lia";

const Listing = () => {
  return (
    <div className='listing'>
      <SmallCard title="Temperature" value="25°C" Icon={LiaTemperatureHighSolid}/>
      <SmallCard title="Temperature" value="25°C" Icon={LiaTemperatureHighSolid}/>
      <SmallCard title="Temperature" value="25°C" Icon={LiaTemperatureHighSolid}/>
      <SmallCard title="Temperature" value="25°C" Icon={LiaTemperatureHighSolid}/>
    </div>
  )
}

export default Listing
