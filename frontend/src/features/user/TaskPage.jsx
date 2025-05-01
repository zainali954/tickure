import { Calendar03Icon, Delete01Icon, Delete02Icon, Edit01Icon, Edit02Icon, FilterHorizontalIcon, LayoutGridIcon, LayoutTable01Icon, PencilEdit02Icon, PlusSignIcon } from 'hugeicons-react';
import React, { useEffect, useState } from 'react';
import TaskCard from '../../components/TaskCard';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentMonthTasks, fetchTasks } from '../../app/slices/taskSlice';
import { fetchLabels, setLabelId, setLabelMode, setLabelName } from '../../app/slices/labelSlice';
import { openForm } from '../../app/slices/uiSlice';
import TaskTable from '../../components/TaskTable';
import { setColor, setCategoryId, setCategoryMode, setCategoryName } from '../../app/slices/categorySlice';
import TaskFilterSidebar from '../../components/TaskFilterSidebar';
import { AnimatePresence } from 'motion/react';
import CalendarView from './CalenderView';
import Pagination from '../../components/Pagination';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';
import { showConfirmModal } from '../../app/slices/confirmationModalSlice';

const TaskPage = () => {
    const { tasks } = useSelector((state) => state.task);
    const { labels } = useSelector((state) => state.labels);
    const { categories } = useSelector((state) => state.category);

    const [showFilters, setShowFilters] = useState(false);
    const [taskView, setTaskView] = useState(() => {
        const savedView = localStorage.getItem("view");
        return savedView ? savedView : 'board';
    });

    const { id: categoryId } = useParams(); // Category ID from URL
    const [searchParams, setSearchParams] = useSearchParams(); // Query params
    const dispatch = useDispatch();

    const today = new Date();
    const startDate = startOfWeek(startOfMonth(today));
    const endDate = endOfWeek(endOfMonth(today));

    const currentCategory = categories.find((cat) => cat._id === categoryId);
    const activeLabel = searchParams.get('labelId'); // Active label filter
    const filter = Object.fromEntries([...searchParams]); // Extract all filters from query params

    // Check if `labelId` exists in filters
    let fullUrl;

    if (filter.labelId) {
        // If `labelId` exists, include it in the URL
        const otherFilters = Object.entries(filter)
            .filter(([key]) => key !== "labelId") // Exclude labelId from other filters
            .map(([key, value]) => `${key}=${value}`) // Format as key=value
            .join("&"); // Join with &

        fullUrl = `categoryId=${categoryId}&labelId=${filter.labelId}${otherFilters ? `&${otherFilters}` : ""}`;
    } else {
        // If `labelId` does not exist, include only other filters
        const otherFilters = Object.entries(filter)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");

        fullUrl = `categoryId=${categoryId}${otherFilters ? `&${otherFilters}` : ""}`;
    }


    const handleLabelClick = (labelID) => {
        if (labelID) {
            // Set only the labelId in the search params, removing all other filters
            setSearchParams({ labelId: labelID });
        } else {
            // Clear all filters if no labelID is provided
            setSearchParams({});
        }
    };


    const countTasksByLabel = (labels, labelId) => {
        const label = labels.find(label => label._id === labelId);
        return label ? label.tasks.length : 0;
    };
    const countTasksByCategory = (tasks, categoryId) => {
        return tasks.filter(task => task.category === categoryId).length;
    };


    const changeTaskView = (view) => {
        setTaskView(view)
        localStorage.setItem("view", view)
    }

    const handleLabelEdit = (label) => {
        dispatch(setLabelId(label._id))
        dispatch(setLabelName(label.label_name))
        dispatch(setLabelMode("edit"))
        dispatch(openForm("labelForm"))
    }
    const handleCategoryEdit = () => {
        dispatch(setCategoryId(currentCategory._id))
        dispatch(setCategoryName(currentCategory.name))
        dispatch(setColor(currentCategory.color))
        dispatch(setCategoryMode("edit"))
        dispatch(openForm("categoryForm"))
    }
    const handleLabelDelete = (labelId) => {
        const labelCount = countTasksByLabel(labels, labelId)
        dispatch(showConfirmModal({
            title: "Are you sure you want to delete this label?",
            message: ` This label is associated with ${labelCount} task(s). Deleting it will permanently remove all related tasks. This action cannot be undone.`,
            payload: labelId,
            action: "deleteLabel",
            categoryId: categoryId
        }));
    }
    const handleCategoryDelete = () => {
        const labelCount = currentCategory.labels.length;
        const taskCount = countTasksByCategory(tasks, currentCategory._id)

        dispatch(showConfirmModal({
            title: "Are you sure you want to delete this Category?",
            message: `This category is associated with ${labelCount} labels and ${taskCount} tasks. Deleting this category will permanently delete all associated labels and tasks. This action cannot be undone. Are you sure you want to proceed?`,
            payload: currentCategory._id,
            action: "deleteCategory"
        }));

    }

    useEffect(() => {
        dispatch(fetchLabels(categoryId)); // Fetch labels for the current category
        if (taskView !== "calendar") {
            dispatch(fetchTasks(fullUrl)); // Fetch tasks with all filters
        } else if (taskView === "calendar") {
            dispatch(fetchCurrentMonthTasks(`/calendar-tasks?${fullUrl}`))
        }
    }, [categoryId, searchParams]);
    const formatDates = (input) => {
        return input.toISOString().split('T')[0];
    }
    useEffect(() => {
        let url = '/calendar-tasks';

        if (categoryId) {
            url = `${url}?categoryId=${categoryId}`; // Update the url with categoryId
        }

        if (filter.labelId) {
            url = `${url}&labelId=${filter.labelId}`; // Update the url with labelId
        }

        url = `${url}${categoryId || filter.labelId ? '&' : '?'}startDate=${formatDates(startDate)}&endDate=${formatDates(endDate)}`;

        dispatch(fetchCurrentMonthTasks(url))
        dispatch(fetchTasks(fullUrl))
    }, []);

    return (
        <div>
            <AnimatePresence>
                {showFilters && <TaskFilterSidebar
                    showFilters={showFilters}
                    onClose={() => setShowFilters(false)}
                    isCalendarView={taskView === "calendar"}
                />}
            </AnimatePresence>

            <div className="flex items-center gap-2 group mt-8">
                <h2 className="font-semibold text-2xl sm:text-3xl text-gray-800 dark:text-gray-200 transition-all">
                    {currentCategory?.name || "Category Name"}

                </h2>


                <button
                    onClick={handleCategoryEdit}
                    title="Edit"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 p-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                    <Edit02Icon className="w-5 h-5 bold" />
                </button>

                <button
                    onClick={handleCategoryDelete}
                    title="Delete"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 p-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                    <Delete02Icon className="w-5 h-5 bold" />
                </button>
            </div>


            <div className="flex flex-wrap items-center gap-6 md:gap-9 mt-8 text-sm">
                {/* All Label Button */}
                <button
                    onClick={() => handleLabelClick(null)}
                    className={`font-medium px-1 pb-1 border-b-2 transition-all duration-300 
                ${!activeLabel
                            ? "text-purple-800 dark:text-purple-400 border-purple-700"
                            : "text-gray-800 dark:text-gray-300 border-transparent hover:text-purple-700 hover:border-purple-600 dark:hover:text-purple-400 dark:hover:border-purple-600"
                        }`}
                >
                    All
                </button>

                {/* Labels */}
                {labels.map((label) => (
                    <div key={label._id} className="relative group">
                        <button
                            onClick={() => handleLabelClick(label._id)}
                            className={`flex items-center gap-2 px-1 pb-1 font-medium border-b-2 transition-all duration-300
                    ${activeLabel === label._id
                                    ? "text-purple-800 dark:text-purple-400 border-purple-700"
                                    : "text-gray-800 dark:text-gray-300 border-transparent hover:text-purple-700 hover:border-purple-600 dark:hover:text-purple-400 dark:hover:border-purple-600"
                                }`}
                        >
                            {label.label_name}
                            <div className="bg-white dark:bg-zinc-700 rounded-full h-5 w-5 grid place-items-center text-xs text-gray-600 dark:text-gray-200 shadow-sm">
                                {label.tasks?.length || 0}
                            </div>
                        </button>

                        {/* Label Action Buttons */}
                        {activeLabel === label._id && (
                            <div className="absolute -top-3 -right-8 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => handleLabelEdit(label)}
                                    title="Edit Label"
                                    className="bg-white dark:bg-zinc-800 text-purple-700 dark:text-purple-400 p-1 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
                                >
                                    <Edit01Icon size={16} />
                                </button>
                                <button
                                    onClick={() => handleLabelDelete(label._id)}
                                    title="Delete Label"
                                    className="bg-white dark:bg-zinc-800 text-red-600 dark:text-red-400 p-1 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
                                >
                                    <Delete01Icon size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {/* Create Label Button */}
                <button
                    onClick={() => dispatch(openForm("labelForm"))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-black dark:text-gray-100 
               bg-purple-100 dark:bg-purple-700/10 border border-purple-200 dark:border-purple-900 
               hover:bg-purple-200 hover:dark:bg-purple-800 transition-all duration-300"
                >
                    New Label
                    <PlusSignIcon size={18} variant="stroke" />
                </button>
            </div>



            {/* toolbar */}
            <div className="mt-6">
                <h4 className="text-2xl font-medium text-gray-800 dark:text-gray-300">Tasks</h4>
                <div className="flex flex-col md:flex-row gap-2 md:justify-between items-center mt-4">
                    <div className="w-full md:w-fit rounded-xl text-sm flex gap-1 p-1 
                    bg-purple-100 border border-purple-200 
                    dark:border-purple-900 dark:bg-purple-700/10 shadow-sm transition-all">

                        {/* Board View Button */}
                        <button
                            onClick={() => changeTaskView("board")}
                            className={`flex-1 flex items-center justify-center gap-1 rounded-lg px-4 py-2 
                                    font-medium text-gray-700 dark:text-gray-400 
                                    border transition-all duration-300 ease-in-out transform
                                    ${taskView === "board"
                                    ? "bg-white dark:bg-zinc-900 border-purple-300 dark:border-purple-800 shadow-sm scale-101 text-black dark:text-gray-50"
                                    : "border-transparent hover:text-black dark:hover:text-white"}`}
                        >
                            <LayoutGridIcon size={18} />
                            Board
                        </button>

                        {/* Table View Button */}
                        <button
                            onClick={() => changeTaskView("table")}
                            className={`flex-1 flex items-center justify-center gap-1 rounded-lg px-4 py-2 
                                    font-medium text-gray-700 dark:text-gray-400 
                                    border transition-all duration-300 ease-in-out transform
                                    ${taskView === "table"
                                    ? "bg-white dark:bg-zinc-900 border-purple-300 dark:border-purple-800 shadow-sm scale-101 text-black dark:text-gray-50"
                                    : "border-transparent hover:text-black dark:hover:text-white"}`}
                        >
                            <LayoutTable01Icon size={18} />
                            Table
                        </button>

                        {/* Calendar View Button */}
                        <button
                            onClick={() => changeTaskView("calendar")}
                            className={`flex-1 flex items-center justify-center gap-1 rounded-lg px-4 py-2 
            font-medium text-gray-700 dark:text-gray-400 
            border transition-all duration-300 ease-in-out transform
            ${taskView === "calendar"
                                    ? "bg-white dark:bg-zinc-900 border-purple-300 dark:border-purple-800 shadow-sm scale-101 text-black dark:text-gray-50"
                                    : "border-transparent hover:text-black dark:hover:text-white"}`}
                        >
                            <Calendar03Icon size={18} />
                            Calendar
                        </button>

                    </div>


                    <div className="rounded-xl flex gap-2 p-2">
                        {/* Filter Button */}
                        <button
                            onClick={() => setShowFilters(prev => !prev)}
                            className="flex items-center gap-2 rounded-xl px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 hover:bg-white hover:dark:bg-zinc-800 shadow-sm ring-1 ring-gray-300 dark:ring-zinc-500 dark:ring-zinc-600transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
                            <FilterHorizontalIcon size={18} variant="stroke" />
                            <span>Filter</span>
                        </button>

                        {/* New Task Button */}
                        <button
                            onClick={() => dispatch(openForm("taskForm"))}
                            className="flex items-center gap-2 rounded-xl px-4 py-2 
               bg-purple-700 text-white 
               hover:bg-purple-700 
               shadow-md ring-1 ring-purple-800 
               transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
                            <span>New Task</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="none">
                                <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>



            <>
                {taskView === "board" ? (
                    <div className="mt-6 space-y-6">
                        {/* 📌 Pinned Tasks */}
                        {tasks?.some(task => task.isPinned) && (
                            <div>
                                <h2 className="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-300">
                                    📌 Pinned Tasks
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {tasks
                                        .filter(task => task.isPinned)
                                        .map(task => (
                                            <TaskCard key={task._id} task={task} />
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* 📋 Other Tasks */}
                        <div>
                            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                📋 Other Tasks
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {tasks?.filter(task => !task.isPinned).length > 0 ? (
                                    tasks
                                        .filter(task => !task.isPinned)
                                        .map(task => (
                                            <TaskCard key={task._id} task={task} />
                                        ))
                                ) : (
                                    <p className="text-gray-500 text-center mt-4">No tasks found</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : taskView === "table" ? (

                    <TaskTable />
                ) : (
                    <CalendarView startDate={startDate} endDate={endDate} />

                )}
            </>
            {taskView !== "calendar" && <Pagination />}



        </div>
    );
};

export default TaskPage;
