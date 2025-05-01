import React from 'react';
import SidebarLink from './SidebarLink';
import SquareIcon from './SquareIcon';
import ThemeToggle from './ThemeToggle';
import { Analytics01Icon, Calendar03Icon, Logout01Icon, Menu01Icon, Setting07Icon } from 'hugeicons-react';
import { useDispatch, useSelector } from 'react-redux';
import { closeMenu, openForm, toggleMenu } from '../app/slices/uiSlice';
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom';
import { logout } from '../app/slices/authSlice';

const UserSidebar = () => {
    const { categories } = useSelector((state) => state.category);
    const { isMenuOpen } = useSelector((state) => state.ui);
    const dispatch = useDispatch()
    const handleLogout = (e) => {
        e.preventDefault();
        const deviceId = localStorage.getItem('deviceId');
        dispatch(logout(deviceId));
        navigate('/');
    };


    // Function to close the menu when a link is clicked
    const handleLinkClick = () => {
        if (isMenuOpen) {
            dispatch(closeMenu()); // Close the menu
        }
    };

    // Toggle form visibility
    const handleOpenForm = () => {
        dispatch(openForm("categoryForm"));
    };

    return (
        <div
            id="sidebar"
            className={`${isMenuOpen ? 'block' : 'hidden'
                } lg:flex fixed top-0 left-0 h-screen w-full lg:w-64 bg-white dark:bg-zinc-950 flex flex-col p-4 z-50 lg:z-10 transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
        >
            {/* Top Section */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-center pt-8 text-black dark:text-gray-200">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="logo" className='w-8' />
                        <h2 className="font-bold text-3xl font-inter">tickure</h2>
                    </div>
                    <button
                        onClick={() => dispatch(toggleMenu())}
                        className="lg:hidden p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        <Menu01Icon size={24} />
                    </button>
                </div>

                {/* Dashboard Link */}
                <div className="side_bar_links mt-6 space-y-2">
                    <SidebarLink
                        to="/user/dashboard"
                        icon={Analytics01Icon}
                        label="Dashboard"
                        exact={true}
                        onClick={handleLinkClick} // Close menu on click
                    />

                    <SidebarLink
                        to="/user/dashboard/calendar"
                        icon={Calendar03Icon}
                        label="Calendar"
                        exact={true}
                        onClick={handleLinkClick} // Close menu on click
                    />

                    {/* Separator */}
                    <hr className="my-5 border-gray-300 dark:border-zinc-700" />

                    {/* Categories Section */}
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-base dark:text-gray-200">Categories</h3>
                        <button
                            onClick={handleOpenForm}
                            className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 border border-purple-700"
                        >
                            Add
                        </button>
                    </div>

                    {/* Category Links */}
                    <div className="mt-4 space-y-2">
                        {categories?.map((category, i) => (
                            <SidebarLink
                                key={category._id}
                                to={`/user/dashboard/tasks/${category._id}`}
                                icon={() => <SquareIcon color={category.color} />}
                                label={category.name}
                                onClick={handleLinkClick} // Close menu on click
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="p-2 bg-white dark:bg-zinc-950 space-y-2 border-t border-gray-200 dark:border-zinc-700">
                <button onClick={handleLogout} className="lg:hidden w-full text-sm font-medium p-3 rounded-md flex items-center gap-2 hover:bg-zinc-300 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-400">
                    <Logout01Icon size={20} />
                    <span>Logout</span>
                </button>
                <Link to={'/user/dashboard/settings'} className="w-full text-sm font-medium p-3 rounded-md flex items-center gap-2 hover:bg-zinc-300 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-400">
                    <Setting07Icon size={20} />
                    <span>Settings</span>
                </Link>
                <ThemeToggle />
            </div>
        </div>
    );
};

export default UserSidebar;
