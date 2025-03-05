import "./Login.css";
import "../../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import video from "../../LoginAssets/login.mp4";
import logo from "../../LoginAssets/logotr.png";
import { FaUserShield } from "react-icons/fa6";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import { Link } from "react-router-dom";

const credentials = {
  username: "admin",
  password: "admin",
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For redirection

  // Simulated authentication function
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent page refresh

    if (!username || !password) {
      setError("Username and Password are required!");
      return;
    }

    verify();
  };

  const verify = () => {
    // Simulated authentication check (replace with real API request)
    if (
      username === credentials.username &&
      password === credentials.password
    ) {
      alert("Login Successful!");
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
    return false;
  };

  return (
    <div className="loginPage flex">
      <div className="container flex">
        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>

          <div className="textDiv">
            <h2 className="title">Smarter Skies, Greener Growth</h2>
            <p>Elevating Precision Agriculture into new heights!</p>
          </div>

          <div className="footerDiv flex">
            <span className="text">{"Don't have an account?"}</span>
            <Link to={"/register"}>
              <button className="btn">Sign Up</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="logo" />
            <h3>Welcome Back!</h3>
          </div>

          <form onSubmit={handleLogin} className="form grid">
            <span>Enter your credentials to Log In</span>

            {error && <p className="error">{error}</p>}

            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flex">
                <FaUserShield className="icon" />
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flex">
                <BsFillShieldLockFill className="icon" />
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn flex">
              <span>Login </span>
              <AiOutlineSwapRight className="icon" />
            </button>

            <span className="forgotPassword">
              Forgot your password? <a href="#">Click Here</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
