import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold">
          LOGO
        </button>
        <a href="/" className="text-gray-300 hover:text-white">หน้าหลัก</a>
        <a href="/create" className="text-gray-300 hover:text-white">สร้างอีเวนต์</a>
      </div>
      <FaUserCircle className="text-2xl" />
    </nav>
  );
};

export default Navbar;
