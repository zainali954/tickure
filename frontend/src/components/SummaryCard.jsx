// import { CheckCircle, Clock, CalendarDays, ListTodo } from "lucide-react";

import { Calendar03Icon, CheckmarkCircle01Icon, AlarmClockIcon, ListViewIcon, RefreshIcon } from "hugeicons-react";
import { motion } from "motion/react"


const iconMap = {
  total: ListViewIcon,
  completed: CheckmarkCircle01Icon,
  overdue: AlarmClockIcon,
  upcoming: Calendar03Icon,
  inprogress: RefreshIcon
};

const colorMap = {
  total: "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100",
  completed: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  overdue: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
  upcoming: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300",
  inprogress: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
};

export default function SummaryCard({ type = "total", label, count }) {
  const Icon = iconMap[type];
  const colorClasses = colorMap[type];

  return (
    <motion.div
    initial={{
      opacity: 0,
      scale:0.9
    }}
    animate={{
      opacity:1,
      scale:1,
      transition:{
        duration:1,
      }
    }}
     className="rounded-2xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 bg-white  transition-colors p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{count}</h2>
      </div>
      <div className={`rounded-full p-2 ${colorClasses}`}>
        <Icon size={22} />
      </div>
    </motion.div>
  );
}
