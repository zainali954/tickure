// components/CategoryOverviewCard.jsx

import { Link } from "react-router-dom";

export default function CategoryOverviewCard({ _id, name, total, upComing, completed, inProgress, overdue }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Link to={`/user/dashboard/tasks/${_id}`} className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-md font-semibold text-gray-800 dark:text-white">
          {name}
        </h4>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {total} tasks
        </span>
      </div>

      {/* Progress Info */}


      <div className="grid grid-cols-2 gap-0 border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden mb-3 text-sm">
        {/* Completed */}
        <div className="p-3 border-b border-r border-gray-200 dark:border-zinc-700 text-green-600 font-semibold flex flex-col items-center">
          {completed}
          <span className="text-gray-500 text-xs font-normal">Completed</span>
        </div>

        {/* In Progress */}
        <div className="p-3 border-b border-gray-200 dark:border-zinc-700 text-yellow-500 font-semibold flex flex-col items-center">
          {inProgress}
          <span className="text-gray-500 text-xs font-normal">In Progress</span>
        </div>

        {/* Upcoming */}
        <div className="p-3 border-r border-gray-200 dark:border-zinc-700 text-blue-500 font-semibold flex flex-col items-center">
          {upComing}
          <span className="text-gray-500 text-xs font-normal">Upcoming</span>
        </div>

        {/* Overdue */}
        <div className="p-3 text-red-500 font-semibold flex flex-col items-center">
          {overdue}
          <span className="text-gray-500 text-xs font-normal">Overdue</span>
        </div>
      </div>


      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-zinc-600 h-2 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Link>
  );
}
