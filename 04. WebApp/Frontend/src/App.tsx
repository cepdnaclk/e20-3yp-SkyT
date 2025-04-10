import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";

function App() {
  return (
    <Box width={"100vw"} height={"100vh"} bgcolor={"hsl(0,0%,95%)"}>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/" element={<Home />}>
            <Route path="/" element={<Navigate to={"/home"} />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* All other routes */}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}
export default App;
