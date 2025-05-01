import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarLink = ({ to, icon: Icon, label, extraClasses = '', exact = false, onClick }) => {
    return (
        <NavLink
            to={to}
            end={exact} // Ensure exact matching for specific links
            className={({ isActive }) =>
                `w-full p-3 text-sm rounded-md flex items-center font-medium 
                ${isActive ? 'bg-zinc-50 dark:bg-zinc-800 dark:text-gray-300 border border-purple-200 dark:border-purple-900 ' : ' text-zinc-800 dark:text-zinc-200'} 
                hover:bg-zinc-200 dark:hover:bg-zinc-700 ${extraClasses}`
            }
            onClick={onClick} // Call the passed onClick function
        >
            {Icon && <Icon size={18} variant="stroke" />}
            <span className="ml-2">{label}</span>
        </NavLink>
    );
};

export default SidebarLink;
