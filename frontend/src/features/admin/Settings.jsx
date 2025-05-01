import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateName, updatePassword } from '../../app/slices/authSlice';
import { showConfirmModal } from '../../app/slices/confirmationModalSlice';

const Settings = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch()

    const handleUpdateName = () => {
        if (name.trim()) {
            dispatch(showConfirmModal({
                title: "Update Name?",
                message: `Are you sure you want to update your name to "${name}"?`,
                payload: name,
                action: "updateName"
            }));
        } else {
            setError('Name cannot be empty');
        }
    };

    const handleUpdatePassword = () => {
        if (password.trim() && newPassword.trim()) {
            dispatch(showConfirmModal({
                title: "Update Password?",
                message: "Are you sure you want to update your password? Please confirm to proceed.",
                action: "updatePassword",
                payload: { currentPassword: password, newPassword },
            }));
        } else {
            setError('Password fields cannot be empty');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md mt-4 border dark:border-zinc-700">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Account Settings</h2>

            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Update Name</label>
                <div className="flex flex-col">
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-2 p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-zinc-700 dark:text-white"
                        placeholder="Enter new name"
                    />
                    <button
                        onClick={handleUpdateName}
                        className="mt-4 w-fit px-4 py-2 bg-purple-700 text-white rounded-md text-sm font-medium hover:bg-purple-600 focus:ring-2 focus:ring-purple-300 ml-auto"
                    >
                        Update Name
                    </button>

                </div>
            </div>

            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Current Password</label>
                <div className="flex flex-col">
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-2 p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-zinc-700 dark:text-white"
                        placeholder="Enter current password"
                    />
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">New Password</label>
                <div className="flex flex-col">
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full mt-2 p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-zinc-700 dark:text-white"
                        placeholder="Enter new password"
                    />
                    <button
                        onClick={handleUpdatePassword}
                        className="mt-4 px-4 ml-auto w-fit py-2 bg-purple-700 text-white rounded-md text-sm font-medium hover:bg-purple-600 focus:ring-2 focus:ring-purple-300"
                    >
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
