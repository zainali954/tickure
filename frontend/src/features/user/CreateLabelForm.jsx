import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLabel, updateLabel, setLabelName, clearLabelForm } from '../../app/slices/labelSlice';
import { useParams } from 'react-router-dom';
import { closeForm } from '../../app/slices/uiSlice';
import { updateLabelInTasks } from '../../app/slices/taskSlice';
import { motion } from 'motion/react';

const CreateLabelForm = () => {
    const { name: labelName, mode, id: labelId } = useSelector(state => state.labels);

    const dispatch = useDispatch();
    const url = useParams();
    const category_id = url['*'].split('/')[1];

    const onClose = () => dispatch(closeForm("labelForm"))

    const handleSubmit = () => {
        if (!labelName) return alert("Label name is required");

        if (mode === "create") {
            if (!category_id) return alert("Category ID is missing");
            dispatch(createLabel({ categoryId: category_id, label_name: labelName }));

        } else if (mode === "edit") {
            if (!labelId) return alert("Label ID is required");
            dispatch(updateLabel({ labelId, label_name: labelName }))
                .unwrap()
                .then((updatedLabel) => {
                    dispatch(updateLabelInTasks(updatedLabel)); // Update tasks with new label name
                })
                .catch((error) => {
                    console.error("Failed to update label in tasks:", error);
                });

        }
        dispatch(clearLabelForm())
        onClose();
    };

    const handleClose = () => {
        dispatch(clearLabelForm())
        onClose();
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-white dark:bg-zinc-800 p-8 rounded-xl w-96 border border-zinc-400 dark:border-zinc-700">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-xl dark:text-gray-300">
                        {mode === 'edit' ? "Update Label" : "Create Label"}
                    </h3>
                    <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Label Name Input */}
                <div className="mt-4">
                    <label htmlFor="label-name" className="block text-gray-700 dark:text-gray-200">Label Name</label>
                    <input
                        id="label-name"
                        type="text"
                        value={labelName}
                        onChange={(e) => dispatch(setLabelName(e.target.value))}
                        className="w-full mt-2 border dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter label name"
                    />
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-4">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-600 text-gray-600 bg-gray-100 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                        {mode === 'edit' ? 'Update' : 'Create'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CreateLabelForm;
