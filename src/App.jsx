import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateEvent from "./pages/Create_Event";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"; // ← เพิ่ม
import EditProfile from './pages/EditProfile';
import './App.css';

function App() {
  return (
    <Router basename="/Local-Vibes-Web-app/">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit-profile" element={<ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;


