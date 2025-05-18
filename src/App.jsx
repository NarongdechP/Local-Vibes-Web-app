import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateEvent from "./pages/Create_Event";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProfile from "./pages/EditProfile";
import EventDetail from "./pages/EventDetail";
import FavoritePage from "./pages/FavoritePage"; // ← เพิ่ม import หน้าแสดง "เย้"
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
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/favorites" element={<FavoritePage />} /> {/* ← หน้าเย้ */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
