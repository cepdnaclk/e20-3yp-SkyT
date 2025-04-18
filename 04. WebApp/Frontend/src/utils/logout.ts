import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  console.log("Logging out...");
  sessionStorage.clear();
  navigate("/login");
}
