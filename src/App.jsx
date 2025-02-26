import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreateEvent from "./pages/Create_Event";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">

        <nav>
          <Link to="/">หน้าหลัก</Link> | <Link to="/create">สร้างอีเวนต์</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
