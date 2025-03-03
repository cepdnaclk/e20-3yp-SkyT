import React from "react";
import "./smallCard.css"; 

const SmallCard = ({ title, value, Icon }) => {
  return (
    <div className="paramCard">
      <div className="paramCardHeader">
        <Icon className="iconCard" />
      </div>
      <div className="paramCardBody">
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default SmallCard;
