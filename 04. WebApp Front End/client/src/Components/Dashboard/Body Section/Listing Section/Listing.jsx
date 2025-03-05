import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './listing.css';
import SmallCard from '../../../widgets/smallCard';

// Icons
import { LiaTemperatureHighSolid } from "react-icons/lia";
import { WiHumidity } from "react-icons/wi";
import { GiChemicalDrop } from "react-icons/gi"; // pH Level
import { FaLeaf } from "react-icons/fa"; // Nitrogen
import { GiPlantRoots } from "react-icons/gi"; // Phosphorus
import { GiFertilizerBag } from "react-icons/gi"; // Potassium

const Listing = () => {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/latest-sensor")
      .then(response => {
        setSensorData(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (!sensorData) {
    return <p>Loading sensor data...</p>;
  }

  return (
    <div className='listing'>
      <SmallCard title="Temperature" value={`${sensorData.temp || 'N/A'} °C`} Icon={LiaTemperatureHighSolid} />
      <SmallCard title="Humidity" value={`${sensorData.humidity || 'N/A'} %`} Icon={WiHumidity} />
      <SmallCard title="pH Level" value={sensorData.ph_lvl || 'N/A'} Icon={GiChemicalDrop} />
      <SmallCard title="Nitrogen" value={`${sensorData.nitrogen_lvl || 'N/A'} mg/kg`} Icon={FaLeaf} />
      <SmallCard title="Phosphorus" value={`${sensorData.posporus_lvl || 'N/A'} mg/kg`} Icon={GiPlantRoots} />
      <SmallCard title="Potassium" value={`${sensorData.pottasuim_lvl || 'N/A'} mg/kg`} Icon={GiFertilizerBag} />
    </div>
  );
};

export default Listing;
