import React from 'react'
import Card from '../../../widgets/card'
import dronecapture from '../../../../Assets/droneimage.jpeg'
function Activity() {
  return (
    <div>
      <Card timestamp="10:58:22AM 05/03/2025" lotNo="Node A" imageSrc={dronecapture}/>
    </div>
  )
}

export default Activity
