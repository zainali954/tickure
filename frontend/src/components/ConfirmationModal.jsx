import { useSelector, useDispatch } from "react-redux";
import { closeTaskModal, deleteTask, } from "../app/slices/taskSlice";
import { deleteCategory } from "../app/slices/categorySlice";
import { deleteLabel, removeTaskFromLabels } from "../app/slices/labelSlice";
import { Edit01Icon, Delete03Icon } from "hugeicons-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { updateName, updatePassword } from "../app/slices/authSlice";
import { hideConfirmModal } from "../app/slices/confirmationModalSlice";

const ConfirmationModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { title, message, action, categoryId, payload } = useSelector((state) => state.confirmationModal);

  const actionMapper = {
    deleteTask: (id) => {
      dispatch(deleteTask(id));
      dispatch(removeTaskFromLabels({ taskId: id }));
      dispatch(closeTaskModal())
    },
    deleteCategory: (id) => {
      dispatch(deleteCategory(id));
      navigate('/user/dashboard');
    },
    deleteLabel: (id) => {
      dispatch(deleteLabel(id));
      navigate(`/user/dashboard/tasks/${categoryId}`);
    },
    updateName: (payload) => dispatch(updateName(payload)),
    updatePassword: (payload) => dispatch(updatePassword(payload)),
  };

  const handleConfirm = async () => {
    try {
      if (action && actionMapper[action]) {
        await actionMapper[action](payload);
      }
      dispatch(hideConfirmModal());
    } catch (err) {
      console.error("Failed to perform action.", err);
    }
  };

  const isDeleteAction = action?.startsWith('delete');

  return (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
    >
      <motion.div
        key="popup"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full max-w-lg rounded-xl shadow-lg p-6 flex flex-col gap-4 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
      >

        {/* Top Icon */}
        <div className={`w-fit ${isDeleteAction ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'} dark:bg-opacity-25 rounded-lg p-2`}>
          {isDeleteAction ? <Delete03Icon size={20} /> : <Edit01Icon size={20} />}
        </div>

        {/* Title and Message */}
        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => dispatch(hideConfirmModal())}
            className="bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 dark:text-zinc-300 text-zinc-800 px-4 py-1.5 rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-1.5 rounded-md text-sm text-white ${isDeleteAction ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            Confirm
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default ConfirmationModal;
