import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import Login from "./pages/Login.jsx";
import SimpleLogin from "./pages/SimpleLogin.jsx";
import TestPage from "./pages/TestPage.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import PrivateRoute from "./components/privateRoutes.jsx";
import Profile from "./pages/Profile.jsx";
import CreateJob from "./pages/createJob.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import ApplicationManagement from "./pages/ApplicationManagement.jsx";
import Notifications from "./pages/Notifications.jsx";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/simple" element={<SimpleLogin />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/footer" element={<Footer />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/job/:id"
            element={
              <PrivateRoute>
                <JobDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-job"
            element={
              <PrivateRoute>
                <CreateJob />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <PrivateRoute>
                <MyApplications />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/application-management"
            element={
              <PrivateRoute>
                <ApplicationManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
