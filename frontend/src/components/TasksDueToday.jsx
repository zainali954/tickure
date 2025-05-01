import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "motion/react"

export default function TasksDueToday() {
  const tasks = useSelector((state) => state.task.todayTasks);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  function formatDate(inputDateStr) {
    const inputDate = new Date(inputDateStr);
    const now = new Date();

    const isToday =
      inputDate.getFullYear() === now.getFullYear() &&
      inputDate.getMonth() === now.getMonth() &&
      inputDate.getDate() === now.getDate();

    const hours = inputDate.getHours();
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = (hours % 12) || 12;

    const timeString = `${formattedHour}:${minutes} ${ampm}`;

    if (isToday) {
      return `Today at ${timeString}`;
    } else {
      return inputDate.toLocaleDateString() + ' at ' + timeString;
    }
  }

  function hexToRGBA(hex, opacity) {
    let c = hex.replace("#", "");
    if (c.length === 3) {
      c = c
        .split("")
        .map((char) => char + char)
        .join("");
    }
    const bigint = parseInt(c, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ 
        y: 0, 
        opacity: 1, 
        transition:{ duration: 1 } 
      }}
      viewport={{
        once: true,
      }}
      
      className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="mb-4 border-b border-zinc-200 dark:border-zinc-700 pb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Tasks Due Today
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{today}</p>
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No tasks ending today 🎉
        </p>
      ) : (
        <ul  className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex justify-between items-center border border-zinc-100 bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
            >
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {task.title}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Due: {formatDate(task.dueDate)}
                </span>
              </div>

              <div className="flex gap-2 items-center">
                {/* Category */}
                <Link to={`/user/dashboard/tasks/${task.category?._id}`}
                  style={{
                    backgroundColor: `${hexToRGBA(task.category?.color, 0.1)}`,
                    border: `1px solid ${task.category?.color}`,
                    color: task.category?.color
                  }}
                  className="px-2 py-1 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200"
                >
                  {task.category?.name}
                </Link>

                {/* Status */}
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${task.status === "Completed"
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                      : task.status === "Overdue"
                        ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                >
                  {task.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
