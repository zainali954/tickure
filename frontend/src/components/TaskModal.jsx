import React from "react";
import { Cancel01Icon,  Delete02Icon, PencilEdit01Icon, PinIcon, TickDouble01Icon } from "hugeicons-react";
import { useDispatch, useSelector } from "react-redux";
import { setTitle, setDescription, setSelectedLabels, setPriority, setStartDate, setDueDate, setTaskMode, setTaskId, clearTaskForm, updateLabelInTasks, addSubTask, toggleSubTaskCompletion, removeSubTask, setSubTaskTitle, openTaskModal, closeTaskModal, toggleSubTask, updateTask, setSubTasks, pinTask } from "../app/slices/taskSlice";
import { openForm } from "../app/slices/uiSlice";
import { formatDateInfo } from "../utils/formatDate";
import calculateTaskProgress from "../utils/calculateTaskProgress.js";
import { format, parseISO } from "date-fns";
import { showConfirmModal } from "../app/slices/confirmationModalSlice";
import { motion } from "motion/react";
function convertDate(inputDate) {
    const parsedDate = parseISO(inputDate); // Parse the input date
    return format(parsedDate, 'yyyy-MM-dd\'T\'HH:mm'); // Format it to the desired format
}

const TaskModal = () => {
    const { selectedTask: task, isTaskModalOpen } = useSelector(state => state.task)
    const { exactTime: exactStartTime, relativeTime: relativeStartTime } = formatDateInfo(task?.startDate);
    const { exactTime: exactDueTime, relativeTime: relativeDueTime } = formatDateInfo(task?.dueDate);
    const progress = calculateTaskProgress(task);

    const toggleSubTaskCom = (subId) => {
        if (task.status === "Overdue") return; // prevent toggling
        dispatch(toggleSubTask({ taskId: task._id, subTaskId: subId }))
    };
    const dispatch = useDispatch()

    // Map status to background colors
    const getStatusColor = (status) => {
        switch (status) {
            case "Not Started":
                return "gray-400";
            case "In Progress":
                return "blue-500";
            case "Completed":
                return "green-500";
            case "Overdue":
                return "red-500";
            default:
                return "gray-400";
        }
    };

    const getpriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case "low":
                return "bg-green-500 text-green-700";
            case "medium":
                return "bg-yellow-400 text-yellow-700";
            case "high":
                return "bg-red-500 text-red-700";
            default:
                return "bg-gray-500 text-gray-700";
        }
    };

    const handleOptionClick = (option) => {
        if (option === "Complete") {
            if (task._id) {
                const data = { "status": "Completed" }
                dispatch(updateTask({ taskId: task._id, data }))
            }
        }

        if (option === "Edit") {
            dispatch(setTaskId(task._id))
            dispatch(setTitle(task.title))
            dispatch(setDescription(task.description))
            dispatch(setPriority(task.priority))
            dispatch(setStartDate(convertDate(task.startDate)))
            dispatch(setDueDate(convertDate(task.dueDate)))
            dispatch(setSubTasks(task.subTasks))
            dispatch(setTaskMode("edit"))
            dispatch(openForm("taskForm"))
            task.labels.forEach(tag => {
                dispatch(setSelectedLabels(tag._id))
            });
            dispatch(closeTaskModal(false))
        }

        if (option === "Delete") {
            dispatch(showConfirmModal({
                title: "Are you sure you want to delete this task?",
                message: "This action cannot be undone",
                payload: task._id,
                action: "deleteTask"
            }));
        }

        if (option === "Pin") {
            dispatch(pinTask({ id: task._id, isPinned: !task.isPinned }));
        }

    };

    if (!isTaskModalOpen) return null;
    return (
        <motion.div
        initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <motion.div 
             initial={{ opacity: 0, scale: 0 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0 }}
             transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full max-w-2xl bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh] scrollbar-base">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                    onClick={() => dispatch(closeTaskModal())}
                >
                    <Cancel01Icon className="w-6 h-6" />
                </button>

                {/* Task task.title */}
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                    {task.title}
                </h2>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-4 md:gap-10">
                            <span className="font-medium text-gray-600 dark:text-zinc-200">Priority:</span>
                            <span
                                className={`text-xs font-medium px-2 py-1 rounded-md ${getpriorityColor(task.priority)} bg-opacity-35  capitalize dark:text-white`}
                            >
                                {task.priority}
                            </span>
                        </div>

                        <div className="flex gap-4 md:gap-10">
                            <span className="font-medium text-gray-600  dark:text-zinc-200">Status:</span>
                            <div className={`flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded text-${getStatusColor(task.status)} `}>
                                <span className={`h-2 w-2 rounded-full bg-${getStatusColor(task.status)}`}></span>
                                <p> {task.status} </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-4 md:gap-10 items-center relative">
                            <span className="font-medium text-gray-600 dark:text-zinc-300">Start Time:</span>
                            <span className={`text-xs font-medium text-gray-500  capitalize dark:text-zinc-400 group`}>
                                {exactStartTime}
                                <span className="bg-zinc-100 border border-zinc-200 rounded-full px-2 py-1 text-xs hidden absolute  -top-6 right-0  group-hover:block">{relativeStartTime}</span>

                            </span>
                        </div>

                        <div className="flex gap-4 md:gap-10 items-center relative">
                            <span className="font-medium text-gray-600 dark:text-zinc-300 ">Due time:</span>
                            <span className={`text-xs font-medium text-gray-500  capitalize dark:text-zinc-400 group`}>
                                {exactDueTime}
                                <span className="bg-zinc-100 border border-zinc-200 rounded-full px-2 py-1 text-xs hidden absolute  top-6 right-0  group-hover:block">{relativeDueTime}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tag */}
                <div className="mb-6 space-x-1 ">
                    {task.labels?.map((tag, i) => (
                        <span
                            key={i}
                            style={{ backgroundColor: tag.color }}
                            className="text-sm text-white px-3 py-1 rounded-full"
                        >
                            {tag.label_name}
                        </span>
                    ))}
                </div>

                {/* Task task.description */}
                <p className="font-semibold text-zinc-700 dark:text-zinc-200 mb-2">Description:</p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 p-4 bg-zinc-50 dark:bg-zinc-700 rounded-md">{task.description}</p>

                {/* Subtasks */}
                <div className="space-y-3 mt-6 mb-6">

                    <h3 className="font-semibold text-gray-700 dark:text-zinc-200 mb-3">Subtasks ({task.subTasks?.length})</h3>

                    {task.subTasks?.length > 0 ? (
                        <ul className="space-y-2">
                            {task.subTasks?.map((subtask, index) => (
                                <li
                                    key={index}
                                    onClick={() => toggleSubTaskCom(subtask._id)}
                                    className={`
                                        flex items-center justify-between gap-2 p-4 rounded-md transition-colors
                                        ${task.status === "Overdue"
                                            ? "bg-zinc-100 dark:bg-zinc-700 opacity-50 cursor-not-allowed"
                                            : "bg-zinc-50 dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 cursor-pointer"
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        {subtask.isCompleted ? (
                                            <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                                                ✓
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-zinc-500" />
                                        )}

                                        <span
                                            className={`text-sm transition-colors ${subtask.isCompleted
                                                ? "line-through text-gray-400"
                                                : "text-gray-800 dark:text-gray-100"
                                                }`}
                                        >
                                            {subtask.title}
                                        </span>
                                    </div>

                                    <span
                                        className={`text-xs font-medium ${subtask.isCompleted
                                            ? "text-green-600"
                                            : "text-gray-400 dark:text-gray-300"
                                            }`}
                                    >
                                        {subtask.isCompleted ? "Completed" : "Pending"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No subtasks added.</p>
                    )}
                </div>

                <div className="w-full max-w-md mx-auto mb-4">
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Progress</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-zinc-600 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-purple-700 h-2 rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>


                <div className="p-6 border-t border-gray-200 dark:border-zinc-700 flex flex-wrap gap-3 justify-end">
                    <button
                        onClick={() => handleOptionClick("Delete")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300 font-medium transition-colors cursor-pointer"
                    >
                        <Delete02Icon size={18} />
                        Delete
                    </button>

                    <button
                        onClick={() => handleOptionClick("Edit")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-gray-200 font-medium transition-colors cursor-pointer"
                    >
                        <PencilEdit01Icon size={18} />
                        Edit
                    </button>

                    <button
                        onClick={() => handleOptionClick("Complete")}
                        disabled={task.status === "Completed" || task.status === "Overdue"}
                        title={
                            task.status === "Completed"
                                ? "Task is already completed"
                                : task.status === "Overdue"
                                    ? "Cannot complete an overdue task"
                                    : "Mark as complete"
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl 
      ${task.status === "Completed" || task.status === "Overdue"
                                ? "bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 border-gray-300 dark:border-zinc-700 cursor-not-allowed"
                                : "bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300 font-medium transition-colors cursor-pointer"
                            }
    `}
                    >
                        <TickDouble01Icon size={18} />
                        Mark as Complete
                    </button>

                    <button
                        onClick={() => handleOptionClick("Pin")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:hover:bg-yellow-800 dark:text-yellow-300 font-medium transition-colors cursor-pointer"
                    >
                        <PinIcon size={18} />
                        {task.isPinned ? "Unpin" : "Pin it"}
                    </button>

                </div>


            </motion.div>
        </motion.div>
    );
};

export default TaskModal;
