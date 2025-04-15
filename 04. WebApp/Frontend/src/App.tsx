import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import People from "./pages/People";
import Message from "./pages/Message";
import DashboardArea from "./pages/Dashboard";
import Dashboard from "./pages/DashBoard.Home";
import { useState } from "react";
import Estate from "./pages/Dashboard.Estate";
import Lot from "./pages/Dashboard.Lot";
import Gallary from "./pages/Dashboard.Gallary";
import LotMap from "./pages/Dashboard.Map";

function App() {
  const [search, setSearch] = useState<string>("");

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
            <Route index element={<Navigate to={"/home"} />} />
            <Route
              path="/home"
              element={<DashboardArea search={search} setSearch={setSearch} />}
            >
              <Route index element={<Dashboard search={search} />} />
              <Route
                path="estate/:estateId"
                element={<Estate search={search} />}
              />
              <Route path="estate/:estateId/lot/:lotId" element={<Lot />} />
              <Route
                path="estate/:estateId/lot/:lotId/gallary"
                element={<Gallary />}
              />
              <Route
                path="estate/:estateId/lot/:lotId/map"
                element={<LotMap />}
              />
            </Route>
            <Route path="notifications" element={<Message />} />
            <Route path="people" element={<People />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* All other routes */}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}
export default App;
