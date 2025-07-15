import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { useState } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

// Routes
import PublicRoute from "./routes/publicRoute";

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
import Estate from "./pages/Dashboard.Estate";
import Lot from "./pages/Dashboard.Lot";
import Gallary from "./pages/Dashboard.Gallary";
import LotMap from "./pages/Dashboard.Map";
import TaskManager from "./pages/TaskManager";
import PrivateRoute from "./routes/PrivateRoute";
import ProtectedRoute from "./routes/ProtectedRoutes";
import EstateSummary from "./pages/Dashboard.EstateSummary";

function App() {
  const [search, setSearch] = useState<string>("");

  return (
    <Box width={"100vw"} height={"100vh"} bgcolor={"hsl(0,0%,95%)"}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route
            path="/forgot"
            element={<PublicRoute element={<ForgotPassword />} />}
          />
          <Route
            path="/reset/:token"
            element={<PublicRoute element={<ResetPassword />} />}
          />

          {/* Private Routes */}
          <Route path="/" element={<PrivateRoute element={<Home />} />}>
            <Route index element={<Navigate to={"home"} />} />

            <Route
              path="home"
              element={<DashboardArea search={search} setSearch={setSearch} />}
            >
              <Route index element={<Dashboard search={search} />} />
              <Route path="estate/:estateId" element={<EstateSummary />} />
              <Route
                path="estate/:estateId/map"
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

            <Route path="taskManager/:estId" element={<TaskManager />} />
            <Route path="notifications" element={<Message />} />
            <Route path="profile" element={<Profile />} />

            {/* Role base routes */}
            <Route
              path="people"
              element={<ProtectedRoute element={<People />} />}
            />
          </Route>

          {/* All other routes */}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>

        <LoadingSpinner />
      </BrowserRouter>
    </Box>
  );
}
export default App;
