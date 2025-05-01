import React from "react";
import { useDispatch } from "react-redux";
import { openTaskModal } from "../app/slices/taskSlice";
import { formatDateInfo } from "../utils/formatDate";
import { CheckListIcon, PinIcon } from "hugeicons-react";

const TaskCard = ({ task }) => {
  const { exactTime: exactStartTime, relativeTime: relativeStartTime } = formatDateInfo(task.startDate);
  const { exactTime: exactDueTime, relativeTime: relativeDueTime } = formatDateInfo(task.dueDate);
  const dispatch = useDispatch()
  const totalCount = task.subTasks?.length || 0;
  const completedCount = task.subTasks?.filter(st => st.isCompleted).length || 0;

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

  const getTagColor = (color) =>{
    return (`bg-[${color}] bg-opacity-10 border border-[${color}] text-[${color}]`)
  }

  const getPriorityColor = (priority) => {
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

  return (
    <>

<div
  onClick={() => dispatch(openTaskModal(task))}
  className={`cursor-pointer h-full w-full relative group overflow-hidden p-4 mt-1 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-purple-600/5 hover:dark:border-zinc-600 hover:border-zinc-300 dark:hover:bg-purple-600/10 transition-all duration-300 bg-white dark:bg-zinc-800`}
>
  {/* 📌 Pin Icon */}
  {task.isPinned && (
    <div className="absolute top-2 right-2 text-gray-400 group-hover:text-yellow-500 transition-all">
      <PinIcon size={20} />
    </div>
  )}

  {/* Priority and Status */}
  <div className="flex gap-2 mb-2">
    {/* Priority */}
    <div className="space-x-1">
      <span
        className={`text-xs font-medium px-2 py-1 rounded-md ${getPriorityColor(
          task.priority
        )} bg-opacity-35 capitalize dark:text-white`}
      >
        {task.priority}
      </span>
    </div>

    {/* Status */}
    <div
      className={`flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded text-${getStatusColor(
        task.status
      )}`}
    >
      <span className={`h-2 w-2 rounded-full bg-${getStatusColor(task.status)}`}></span>
      <p>{task.status}</p>
    </div>
  </div>

  {/* Title */}
  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{task.title}</h3>

  {/* Description */}
  <p
    className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3"
    title={task.description}
  >
    {task.description}
  </p>

  {/* Subtasks */}
  {totalCount > 0 && (
    <div
      className={`text-xs text-gray-500 mt-1 italic flex items-center gap-2 ${
        completedCount === totalCount && "text-green-600"
      }`}
    >
      <CheckListIcon size={18} />
      {completedCount} / {totalCount} subtasks completed
    </div>
  )}

  {totalCount === 0 && task.status === "Completed" && (
    <div className="text-xs text-green-600 italic mt-2">All done (100%)</div>
  )}

  {/* Timeline */}
  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
    <p>
      Start: <span className="font-medium">{relativeStartTime}</span>
    </p>
    <p>
      Due: <span className="font-medium">{relativeDueTime}</span>
    </p>
  </div>

  {/* Labels */}
  <div className="mt-4 space-x-1">
    {task?.labels?.map((tag, i) => (
      <span
        key={i}
        style={{ backgroundColor: tag.color }}
        className="text-sm text-white px-3 py-1 rounded-full"
      >
        {tag.label_name}
      </span>
    ))}
  </div>
</div>

    </>
  );
};

export default TaskCard;
