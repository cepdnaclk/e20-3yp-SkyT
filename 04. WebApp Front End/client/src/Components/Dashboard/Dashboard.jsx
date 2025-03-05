import Sidebar from "./SideBar Section/SideBar";
import Body from "./Body Section/Body";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashPage flex">
      <div className="dashcontainer">
        <Sidebar />
        <Body />
      </div>
    </div>
  );
};

export default Dashboard;
