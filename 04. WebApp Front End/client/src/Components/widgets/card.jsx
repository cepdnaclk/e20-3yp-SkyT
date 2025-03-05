import React from "react";
import "./Card.scss";

const Card = ({ timestamp, lotNo, imageSrc }) => {
  return (
    <div className="card">
      <div className="cardHeader">
      <h2 className="lotNo">Lot No: {lotNo}</h2>
        <p className="timestamp">{timestamp}</p>
        
      </div>
      <div className="cardBody">
        <img src={imageSrc} alt="Card content"  />
      </div>
    </div>
  );
};

export default Card;
