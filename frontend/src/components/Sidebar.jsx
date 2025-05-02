import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from "../assets/logo.png"
import { Menu01Icon } from 'hugeicons-react';
import { useDispatch } from 'react-redux';
import ThemeToggle from './ThemeToggle';

const Sidebar = ({ isMenuHidden, toggleMenu, handleLogout }) => {
  const links = [
    {to:"/admin/dashboard", title:"Dashboard"},
    {to:"/admin/dashboard/users", title:"Users"},
    {to:"/admin/dashboard/settings", title:"Settings"},
  ]
  const dispatch = useDispatch()
  return (
    <aside
      className={`transition-all duration-300 fixed md:block ${
        isMenuHidden ? 'hidden' : ''
      } border-r border-gray-200 bg-white z-50 dark:bg-zinc-950 dark:border-zinc-700 shadow-lg p-4 w-full sm:w-64 h-screen flex flex-col`}
    >
      {/* Sidebar Heading */}
      <div className="flex justify-between items-center pt-2 text-black dark:text-gray-200">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-8" />
          <h2 className="font-bold text-3xl font-inter">tickure</h2>
        </div>
        <button
          onClick={() => dispatch(toggleMenu())}
          className="md:hidden p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Menu01Icon size={24} />
        </button>
      </div>
  
      {/* Navigation */}
      <nav className="mt-4 flex-1">
        <ul className="space-y-1">
          {links.map((l) => (
            <Navlink key={l.to} to={l.to} title={l.title} />
          ))}
        </ul>
      </nav>
  
      {/* Theme + Logout group at bottom */}
      <div className="space-y-2 border-t border-gray-200 dark:border-zinc-700 pt-4">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="w-full text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>
    </aside>
  );  
};

export default Sidebar;

const Navlink = ({to, title}) => {
  return (
    <li>
      <NavLink to={to} end={true} className={({ isActive }) =>
        `w-full p-3 text-sm rounded-md flex items-center font-medium 
                ${isActive ? 'bg-zinc-50 dark:bg-zinc-800 dark:text-gray-300 border border-purple-200 dark:border-purple-900 ' : ' text-zinc-800 dark:text-zinc-200'} 
                hover:bg-zinc-200 dark:hover:bg-zinc-700`
      }
      >
        {title}
      </NavLink>
    </li>
  )
}