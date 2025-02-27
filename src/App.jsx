import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateEvent from "./pages/Create_Event";
import Navbar from "./components/Navbar";
import './App.css'

function App() {
  return (
    <Router basename="/">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
