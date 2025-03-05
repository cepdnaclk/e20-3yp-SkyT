//css
import "./Top.css";
// Icons
import { BiSearchAlt } from "react-icons/bi";
import { FiMessageCircle } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";

//Assets
import userProfile from "../../../../Assets/user.png";
const Top = () => {
  return (
    <div className="topSection">
      <div className="headerSection flex">
        <div className="title">
          <h1>Welcome to Sky T</h1>
          <p>Logie Estate, Thalwakelle Tea Plantations</p>
        </div>

        <div className="searchBar flex">
          <input type="text" placeholder="Search" />
          <BiSearchAlt className="icon" />
        </div>

        <div className="adminDiv flex">
          <FiMessageCircle className="icon" />
          <IoMdNotificationsOutline className="icon" />
          <div className="adminImage">
            <img src={userProfile} alt="Admin" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top;
