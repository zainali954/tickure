import React, { useState } from 'react';
import { useNavigate, createSearchParams, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Cancel01Icon } from 'hugeicons-react';

const TaskFilterSidebar = ({ showFilters, onClose, isCalendarView }) => {
    const navigate = useNavigate();
    const { id: categoryId } = useParams();
    const [searchParams] = useSearchParams();
    const labelId = searchParams.get("labelId");

    const [filters, setFilters] = useState({
        priority: '',
        status: '',
        search: '',
        startDate: '',
        dueDate: '',
        sortBy: isCalendarView ? "dueDate" : 'startDate', // Default sorting by startDate
        sortOrder: 'asc', // Default sorting order
    });

    const onSearch = () => {
        const query = {};

        if (filters.priority) query.priority = filters.priority;
        if (filters.status) query.status = filters.status;
        if (filters.search) query.search = filters.search;
        if (filters.startDate) query.startDate = filters.startDate;
        if (filters.dueDate) query.dueDate = filters.dueDate;
        if (filters.sortBy) query.sortBy = filters.sortBy;
        if(!isCalendarView){
            if (filters.sortOrder) query.sortOrder = filters.sortOrder;
        }

        if (labelId) query.labelId = labelId;

        navigate({
            pathname: `/user/dashboard/tasks/${categoryId}`,
            search: `?${createSearchParams(query)}`
        });
    };

    const handleChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    const handlePresetStartDate = (type) => {
        const today = new Date();
        let resultDate = new Date();

        if (type === 'today') {
            resultDate = today;
        } else if (type === 'tomorrow') {
            resultDate.setDate(today.getDate() + 1);
        } else if (type === 'thisWeek') {
            const daysUntilSunday = 7 - today.getDay();
            resultDate.setDate(today.getDate() + daysUntilSunday);
        }
        handleChange('startDate', resultDate.toISOString().split('T')[0]);
    };

    const handlePresetDueDate = (type) => {
        const today = new Date();
        let resultDate = new Date();

        if (type === 'today') {
            resultDate = today;
        } else if (type === 'tomorrow') {
            resultDate.setDate(today.getDate() + 1);
        } else if (type === 'thisWeek') {
            const daysUntilSunday = 7 - today.getDay();
            resultDate.setDate(today.getDate() + daysUntilSunday);
        } else if (type === 'thisMonth') {
            resultDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        }
        handleChange('dueDate', resultDate.toISOString().split('T')[0]);
    };

    const handleClear = () => {
        setFilters({
            priority: '',
            status: '',
            search: '',
            startDate: '',
            dueDate: '',
            sortBy: 'startDate',
            sortOrder: 'asc',
        });
        navigate(`/user/dashboard/tasks/${categoryId}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 bottom-0 right-0 w-80 bg-white dark:bg-zinc-900 border dark:border-zinc-700 shadow-xl overflow-y-auto z-50 "
        >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                <h3 className="text-lg font-semibold dark:text-zinc-200">
                    Filter Tasks
                </h3>
                <button onClick={onClose} className="text-gray-500 hover:text-red-500">
                    <Cancel01Icon size={20} />
                </button>
            </div>
            <div className="w-full p-5">

                {/* Conditional Filters Based on View */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Priority</label>
                        <select
                            className="w-full text-sm px-3 py-2 rounded-md border dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                            value={filters.priority}
                            onChange={(e) => handleChange('priority', e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>


                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Status</label>
                        <select
                            className="w-full text-sm px-3 py-2 rounded-md border dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                            value={filters.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                    


                    {/* Sorting */}
                    {!isCalendarView && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Sort By</label>
                                <select
                                    className="w-full text-sm px-3 py-2 rounded-md border dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                                    value={filters.sortBy}
                                    onChange={(e) => handleChange('sortBy', e.target.value)}
                                >
                                    <option value="startDate">Start Date</option>
                                    <option value="dueDate">Due Date</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Order</label>
                                <select
                                    className="w-full text-sm px-3 py-2 rounded-md border dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                                    value={filters.sortOrder}
                                    onChange={(e) => handleChange('sortOrder', e.target.value)}
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                        </>
                    )}
                </div>

                {/* Search */}
                <div className="mb-5">
                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Search</label>
                    <input
                        type="text"
                        placeholder="Title or Description..."
                        className="w-full text-sm px-3 py-2 rounded-md border dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>

                {/* Start Date with Presets */}
                {!isCalendarView && (
                    <div div className="mb-5">
                        <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Start Date</label>

                        <div className="flex gap-2 mb-3">
                            <button
                                onClick={() => handleChange('startDate', new Date().toISOString().split('T')[0])}
                                className="flex-1 py-1 text-sm bg-purple-50 dark:bg-zinc-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-zinc-700 rounded-md hover:bg-purple-100 dark:hover:bg-zinc-700"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => handleChange('startDate', new Date(Date.now() + 86400000).toISOString().split('T')[0])}
                                className="flex-1 py-1 text-sm bg-purple-50 dark:bg-zinc-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-zinc-700 rounded-md hover:bg-purple-100 dark:hover:bg-zinc-700"
                            >
                                Tomorrow
                            </button>
                        </div>

                        <input
                            type="date"
                            className="w-full text-sm px-3 py-2 rounded-md border dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                            value={filters.startDate}
                            onChange={(e) => handleChange('startDate', e.target.value)}
                        />
                    </div>
                )}

                {/* Due Date with Presets */}
                {!isCalendarView && (

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Due Date</label>

                        <div className="flex gap-2 mb-3">
                            <button
                                onClick={() => handleChange('dueDate', new Date().toISOString().split('T')[0])}
                                className="flex-1 py-1 text-sm bg-purple-50 dark:bg-zinc-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-zinc-700 rounded-md hover:bg-purple-100 dark:hover:bg-zinc-700"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => handleChange('dueDate', new Date(Date.now() + 86400000).toISOString().split('T')[0])}
                                className="flex-1 py-1 text-sm bg-purple-50 dark:bg-zinc-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-zinc-700 rounded-md hover:bg-purple-100 dark:hover:bg-zinc-700"
                            >
                                Tomorrow
                            </button>
                        </div>

                        <input
                            type="date"
                            className="w-full text-sm px-3 py-2 rounded-md border dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                            value={filters.dueDate}
                            onChange={(e) => handleChange('dueDate', e.target.value)}
                        />
                    </div>
                )}

                {/* Apply Filters Button */}
                <button
                    onClick={onSearch}
                    className="w-full py-2 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600"
                >
                    Apply Filters
                </button>

                {/* Clear Filters Button */}
                <button
                    onClick={handleClear}
                    className="w-full py-2 mt-3 text-sm bg-gray-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-600"
                >
                    Clear Filters
                </button>
            </div>
        </motion.div >
    );
};

export default TaskFilterSidebar;
