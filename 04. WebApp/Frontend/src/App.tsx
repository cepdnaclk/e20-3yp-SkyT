import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Box } from "@mui/material";
import PageNotFound from "./pages/PageNotFound";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Box width={"100vw"} height={"100vh"} bgcolor={"ghostwhite"}>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route path="/" element={<Navigate to={"/home"} />} />
          <Route path="/home" element={<Home />} />

          {/* All other routes */}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}
export default App;
