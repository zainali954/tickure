import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import UserSidebar from '../../components/UserSidebar';
import Topbar from '../../components/Topbar';
import Home from './Home';
import TaskPage from './TaskPage';
import CreateCategoryForm from './CreateCategoryForm';
import CreateLabelForm from './CreateLabelForm';
import { closeForm } from '../../app/slices/uiSlice';
import CreateTaskForm from './CreateTaskForm';
import { fetchCategories } from '../../app/slices/categorySlice';
import FAQ from './FAQS';
import { AnimatePresence } from 'motion/react';
import TaskModal from '../../components/TaskModal';
import CalendarPage from './CalendarPage';
import AccountSettings from './AccountSettings';

const Dashboard = () => {
  const dispatch = useDispatch();
  const {isTaskModalOpen} = useSelector(state => state.task)
  const {labels} = useSelector(state => state.labels)
  const { categories } = useSelector((state) => state.category)
  const { user } =  useSelector((state)=> state.auth)

  const isCategoryFormOpen = useSelector(state => state.ui.categoryForm)
  const isLabelFormOpen = useSelector(state => state.ui.labelForm)
  const isTaskFormOpen = useSelector(state => state.ui.taskForm)

  useEffect(() => {
    if (user && user.isVerified){
    if (categories?.length === 0) {
      dispatch(fetchCategories());
    }
  }
  }, [dispatch, categories, user]);

  return (
    <>
      <AnimatePresence>
        {isCategoryFormOpen && <CreateCategoryForm onClose={() => dispatch(closeForm("categoryForm"))} />}
        {isLabelFormOpen && <CreateLabelForm />}
        {isTaskFormOpen && <CreateTaskForm labels={labels} />}
      {isTaskModalOpen && <TaskModal />}
      </AnimatePresence>

      {/* Tasks Section */}

      {/* sidebar */}
      <div className="flex dark:bg-zinc-950">
        <UserSidebar />

        {/* main content */}
        <div className="flex-1 min-h-screen w-full  bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-4 m-2 lg:m-4  lg:ms-64">
          {/* navbar */}
          <Topbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="/faqs" element={<FAQ />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route
              path="/tasks/:id"
              element={<TaskPage />}
            />

          </Routes>

        </div>
      </div>

    </>

  );
};

export default Dashboard;
