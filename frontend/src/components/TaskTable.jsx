import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PinIcon, ViewIcon } from "hugeicons-react";
import { openTaskModal } from "../app/slices/taskSlice";
import { format } from "date-fns";

const formatDate = (isoDate, formatPattern = "MMM d, yyyy h:mm a") => {
  if (!isoDate) return "Invalid Date"; // Handle missing or invalid dates
  const parsedDate = new Date(isoDate);

  if (isNaN(parsedDate)) return "Invalid Date"; // Handle invalid dates

  return format(parsedDate, formatPattern);
};

const TaskTable = () => {
    const { tasks } = useSelector((state) => state.task);
    const dispatch = useDispatch()

    const getStatusColor = (status) => {
        switch (status) {
            case "Not Started":
                return "text-zinc-400";
            case "In Progress":
                return "text-blue-500";
            case "Completed":
                return "text-green-500";
            case "Overdue":
                return "text-red-500";
            default:
                return "text-zinc-400";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case "low":
                return "bg-green-500 text-green-700 dark:text-green-300";
            case "medium":
                return "bg-yellow-400 text-yellow-700 dark:text-yellow-300";
            case "high":
                return "bg-red-500 text-red-700 dark:text-red-300";
            default:
                return "bg-gray-500 text-gray-700 dark:text-gray-300";
        }
    };

    return (
        <div className="overflow-x-auto mt-4 w-full">
            <div className="min-w-full overflow-x-auto">
                <table className="min-w-full text-sm table-auto border border-zinc-200 dark:border-zinc-700">
                    <thead>
                        <tr className="bg-zinc-100 dark:bg-zinc-800 text-left text-zinc-700 dark:text-zinc-200">
                            <th className="px-4 py-3 border border-zinc-200 dark:border-zinc-700">Title</th>
                            <th className="px-4 py-3 border border-zinc-200 dark:border-zinc-700">Priority</th>
                            <th className="px-4 py-3 border border-zinc-200 dark:border-zinc-700">Status</th>
                            <th className="px-4 py-3 border border-zinc-200 dark:border-zinc-700">Start Time</th>
                            <th className="px-4 py-3 border border-zinc-200 dark:border-zinc-700">End Time</th>
                            <th className="px-4 py-3 border border-zinc-200 dark:border-zinc-700">Tags</th>
                            <th className="px-4 py-3 border border-zinc-200 dark:border-zinc-700">Subtasks</th>
                            <th className="px-4 py-3 border border-zinc-200 dark:border-zinc-700">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">
                        {tasks?.length > 0 &&
                            tasks.map((task) => {
                                const total = task.subTasks?.length || 0;
                                const completed = task.subTasks?.filter((st) => st.isCompleted).length || 0;
                                const percentage = total === 0 ? 0 : Math.floor((completed / total) * 100);

                                return (
                                    <tr key={task._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                                        <td className="px-4 py-3 border border-zinc-200 dark:border-zinc-700"><span> {task.isPinned && <PinIcon size={18}/>} {task.title} </span></td>
                                        <td className="px-4 py-3 border border-zinc-200 dark:border-zinc-700">
                                            <span className={`px-2 py-1 rounded text-xs bg-opacity-35 capitalize ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border border-zinc-200 dark:border-zinc-700">
                                            <span className={`flex items-center gap-1 font-medium ${getStatusColor(task.status)}`}>
                                                <span className="h-2 w-2 rounded-full bg-current" />
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                            {formatDate(task.startDate)}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                            {formatDate(task.dueDate)}
                                        </td>
                                        <td className="px-4 py-3 border border-zinc-200 dark:border-zinc-700">
                                            <div className="flex flex-wrap gap-1">
                                                {task?.labels?.map((tag, i) => (
                                                    <span key={i} className="text-white text-xs px-2 py-1 rounded-full" style={{ backgroundColor: tag.color }}>
                                                        {tag.label_name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border border-zinc-200 dark:border-zinc-700">
                                            {total > 0 ? (
                                                <div className="w-full">
                                                    <div className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500 transition-all" style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 italic">
                                                        {completed} / {total} subtasks completed
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs italic text-zinc-400">No subtasks</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center border border-zinc-200 dark:border-zinc-700">
                                            <button
                                                onClick={() => dispatch(openTaskModal(task))}
                                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                                title="View Task"
                                            >
                                                <ViewIcon size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default TaskTable;
