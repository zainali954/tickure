import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Routes, Route, useNavigate } from "react-router-dom"; // Ensure Outlet is imported
import { logout } from "../../app/slices/authSlice";
import { Menu01Icon } from "hugeicons-react";
import Sidebar from "../../components/Sidebar";
import UserManagement from "./Users"
import DashboardHome from "./DashboardHome";
import { fetchUsers } from "../../app/slices/userSlice";
import { fetchStats } from "../../app/slices/statsSlice";
import Settings from "./Settings";

// AdminPanel component
const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = () => {
    const deviceId = localStorage.getItem('deviceId');
    dispatch(logout(deviceId));
    navigate("/login");  // Redirect to login page after logout
  };

  const [isMenuHidden, setIsMenuHidden] = useState(true); // Track menu visibility state

  const toggleMenu = () => {
    setIsMenuHidden(prevState => !prevState); // Toggle the visibility state
  };

  
useEffect(() => {
  dispatch(fetchUsers())
  dispatch(fetchStats())

}, [])

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isMenuHidden={isMenuHidden} toggleMenu={toggleMenu} handleLogout={handleLogout} />
      {/* Main Content */}
      <main className="w-full md:ml-64 overflow-x-hidden">
        {/* top bar */}
        <nav className="bg-white dark:bg-zinc-950 shadow-lg p-4 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex justify-between items-center">
            {/* Logo or Title */}
            <div className=" text-xl font-bold dark:text-gray-200">
              <Link to="/">Admin Panel</Link>
            </div>

            {/* Links */}
            <button
              onClick={() => dispatch(toggleMenu())}
              className="md:hidden p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-gray-200"
            >
              <Menu01Icon size={24} />
            </button>

          </div>
        </nav>

        <div className="p-4 bg-gray-50 dark:bg-zinc-900 min-h-screen ">
          <Routes>
            {/* Define the main routes */}
            <Route path="/" element={<DashboardHome toggleMenu={toggleMenu} />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};



export default AdminPanel;
