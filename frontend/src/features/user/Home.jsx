import React, { useEffect, useState } from 'react';
import { motion } from "motion/react"
import { useDispatch, useSelector } from 'react-redux';
import GetStarted from './GetStarted';
import { toggleGuide } from '../../app/slices/uiSlice';
import SummaryCard from '../../components/SummaryCard';
import TasksDueToday from '../../components/TasksDueToday';
import TaskStatusChart from '../../components/TaskStatusChart';
import CategoryOverviewCard from '../../components/CategoryOverviewCard';
import { PlusSignIcon } from 'hugeicons-react';
import { fetchStats, fetchTasksDueToday } from '../../app/slices/taskSlice';

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    const { stats } = useSelector((state) => state.task);
    const { guide } = useSelector((state) => state.ui);
    const dispatch = useDispatch();

    useEffect(() => {
        if(user && user.isVerified){
            dispatch(fetchStats());
        dispatch(fetchTasksDueToday())
        }
    }, [user, dispatch]);

    return (
        <div id="home">
            {guide && <GetStarted />}
            <div className="flex items-center justify-between mt-8">
                <div className="flex items-baseline flex-col md:flex-row gap-2">
                    <h2 className="font-bold text-3xl text-gray-800 dark:text-gray-200">
                        Hello {user?.name || 'User'}!
                    </h2>
                    <p className="text-sm font-thin text-gray-600 dark:text-gray-400">
                        It's good to see you again.
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => dispatch(toggleGuide())}
                    className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-normal flex gap-1 items-center transition duration-100"
                >
                    <span>New Task</span>
                    <PlusSignIcon size={18} />
                </motion.button>
            </div>

            {/* Quick Analytics Section */}
            <div className="mt-6">

                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300">Quick Analytics</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2 mb-4">
                <SummaryCard type="total" label="Total Tasks" count={stats?.totalTasks} />
                <SummaryCard type="completed" label="Completed" count={stats?.completedTasks} />
                <SummaryCard type="inprogress" label="Inprogress" count={stats?.inProgressTasks} />
                <SummaryCard type="upcoming" label="Upcoming" count={stats?.upCommingTasks} />
                <SummaryCard type="overdue" label="Overdue" count={stats?.overdueTasks} />
            </div>
            {/* Task Status Chart */}
            <TaskStatusChart />

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
             className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className=" bg-white dark:bg-zinc-950  p-4 rounded-2xl  border border-zinc-200 dark:border-zinc-800 h-[380px] flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Category Overview
                    </h3>

                    <div className="grid  grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto scrollbar-base pr-2">
                        {stats?.stats && stats.stats.length > 0 ?
                            stats.stats.map((cat, i) => (
                                <CategoryOverviewCard key={i} {...cat} />
                            ))
                            : <p className="text-sm text-gray-500 dark:text-gray-400 italic">No categories available</p>
                        }

                    </div>
                </div>

                <TasksDueToday />

            </motion.div>
        </div>
        </div >
    );
};

export default Home;
