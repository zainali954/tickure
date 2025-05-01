import React from "react";
import { format } from "date-fns";
import { Cancel01Icon } from "hugeicons-react";
import TaskCard from "./TaskCard";
import { motion } from "motion/react";

const SidebarModal = ({ date, tasks, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 right-0 w-80 h-full bg-white dark:bg-zinc-900 shadow-xl border-l border-gray-200 dark:border-zinc-700 z-30 animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                <h3 className="text-lg font-semibold dark:text-zinc-200">
                    {format(date, "PPP")} Tasks
                </h3>
                <button onClick={onClose} className="text-gray-500 hover:text-red-500">
                    <Cancel01Icon size={20} />
                </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-64px)]">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div className="h-fit">
                            <TaskCard key={task._id} task={task} />
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-400">No tasks for this day.</div>
                )}
            </div>
        </motion.div>
    );
};

export default SidebarModal;
