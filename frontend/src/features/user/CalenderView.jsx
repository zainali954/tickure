import React, { useState } from "react";
import { addDays, isSameDay, isSameMonth, format,} from "date-fns";
import { useSelector } from "react-redux";
import SidebarModal from "../../components/SidebarModal";
import { AnimatePresence } from "motion/react";

const CalendarView = ({startDate, endDate}) => {
  const { calendarTasks: tasks } = useSelector((state) => state.task);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(null);

  const dateMatrix = [];
  let day = startDate;
  while (day <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    dateMatrix.push(week);
  }

  const getTasksForDate = (date) => {
    return tasks.filter((task) => isSameDay(new Date(task.dueDate), date));
  };

  return (
    <div className="relative w-full h-full px-2 md:px-6">
      <h2 className="text-2xl font-bold text-center dark:text-zinc-200 my-4">
        {format(today, "MMMM yyyy")}
      </h2>

      <div className="flex items-center gap-2 mb-4 text-sm text-zinc-600 dark:text-zinc-300">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span>Marked dates indicate task due dates</span>
      </div>

      <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium text-gray-500 border border-gray-200 dark:border-zinc-700 py-2 mb-2 bg-white dark:bg-zinc-800 dark:text-zinc-300 rounded-xl overflow-hidden">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="px-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3">
        {dateMatrix.map((week, wi) =>
          week.map((date, di) => {
            const tasksForDate = getTasksForDate(date);
            const isToday = isSameDay(date, today);
            const isCurrentMonth = isSameMonth(date, today);

           // Assign background class based on tasks
let bgClass = "";
let textClass = ""; // <-- New addition
let borderClass = ""; // <-- For more control

if (tasksForDate.length > 0) {
  const allCompleted = tasksForDate.every(task => task.status === "Completed");
  const anyOverdue = tasksForDate.some(task => new Date(task.dueDate) < today && task.status !== "Completed");

  if (allCompleted) {
    bgClass = "bg-green-500/10 dark:bg-green-600/10";
    textClass = "text-green-700 dark:text-green-400"; // <-- Green text
    borderClass = "border-green-300 dark:border-green-700";
  } else if (anyOverdue) {
    bgClass = "bg-red-500/10 dark:bg-red-600/10";
    textClass = "text-red-700 dark:text-red-400"; // <-- Red text
    borderClass = "border-red-300 dark:border-red-700";
  }
}

// Base class: only apply if no status
const baseBgClass = !bgClass && isCurrentMonth
  ? "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-600 dark:text-gray-200"
  : !bgClass
  ? "bg-gray-50 text-gray-400 dark:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
  : "";

return (
  <div
    key={di}
    className={`h-12 md:h-24 border rounded-xl flex flex-col items-center justify-center text-xs sm:text-sm cursor-pointer transition-all duration-200
      ${isToday ? "border-2 !border-purple-500 dark:!border-purple-400 bg-purple-700/10 dark:bg-purple-700/20" : ""}
      ${baseBgClass}
      ${bgClass}
      ${textClass}
      ${borderClass}
      hover:shadow-md hover:scale-[1.02] hover:ring-1 hover:ring-purple-400 dark:hover:ring-purple-500`}
    onClick={() => {
      setSelectedDate(date);
    }}
  >

                <div className="text-base font-semibold">{format(date, "d")}</div>

                {tasksForDate.length > 0 && (
                  <div
                    className={`mt-1 text-[10px] sm:text-[11px] w-full sm:w-fit flex gap-2 px-2 py-0.5 rounded-full font-medium text-center
                    ${tasksForDate.every(task => task.status === "Completed")
                        ? "bg-green-200 text-green-800"
                        : tasksForDate.some(task => new Date(task.dueDate) < today && task.status !== "Completed")
                          ? "bg-red-200 text-red-800"
                          : "bg-purple-200 text-purple-800"
                      }`}
                  >
                    {tasksForDate.length}
                    <span className="hidden sm:block">
                      task{tasksForDate.length > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {selectedDate && (
          <SidebarModal
            date={selectedDate}
            tasks={getTasksForDate(selectedDate)}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarView;
