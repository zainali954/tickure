import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleMenu } from '../app/slices/uiSlice';
import Clock from './Clock';
import { logout } from '../app/slices/authSlice';

const Topbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = (e) => {
        e.preventDefault();
        const deviceId = localStorage.getItem('deviceId');
        dispatch(logout(deviceId));
        navigate('/');
    };

    return (
        <div className="p-3 flex justify-between bg-white dark:bg-zinc-950 rounded-2xl border-2 dark:border-zinc-800 border-zinc-200">
            <div className="flex gap-2 items-center ">
                <button className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black">{user?.name?.charAt(0)}</button>
                <span className="font-semibold text-lg dark:text-white">{user?.name || 'User'}</span>
            </div>
            <div className="hidden lg:flex relative items-center">
                <Clock />

            </div>
            <button onClick={() => { dispatch(toggleMenu()) }} className="lg:hidden  text-black dark:text-white px-4 py-2 rounded-xl">
                <svg className='' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} fill={"none"}>
                    <path d="M4 5L20 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 19L20 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <button
                onClick={handleLogout}
                title="Logout"
                className="hidden lg:block px-4 py-2 rounded-xl bg-black text-white 
             dark:bg-white dark:text-black 
             hover:bg-gray-800 hover:dark:bg-gray-200 
             hover:scale-[1.03] transition-all duration-300 font-medium shadow-sm"
            >
                Log out
            </button>

        </div>
    )
}

export default Topbar
