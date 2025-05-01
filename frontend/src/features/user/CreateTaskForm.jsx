import { useDispatch, useSelector } from "react-redux";
import { addSubTask, clearTaskForm, createTask, removeSubTask, setDescription, setDueDate, setPriority, setSelectedLabels, setStartDate, setSubTaskTitle, setTitle, toggleSubTaskCompletion, updateTask } from "../../app/slices/taskSlice";
import { useParams } from "react-router-dom";
import { Flag01Icon, PlusSignIcon } from "hugeicons-react";
import { closeForm } from "../../app/slices/uiSlice";
import toast from "react-hot-toast";
import useSmartTaskRedirect from "../../hooks/useSmartTaskRedirect";
import { motion } from "motion/react";
import { pushTaskToLabels } from "../../app/slices/labelSlice";

const priorities = {
    low: "text-green-600 bg-green-100 dark:bg-green-500 dark:bg-opacity-20 dark:text-green-400",
    medium: "text-yellow-700 bg-yellow-100 dark:bg-yellow-500 dark:bg-opacity-20 dark:text-yellow-400",
    high: "text-red-600 bg-red-100 dark:bg-red-500 dark:bg-opacity-20 dark:text-red-400",
};

const CreateTaskForm = () => {
    const { title, description, selectedLabels, priority, startDate, dueDate, subTasks, mode, id: taskId, selectedTask } = useSelector((state) => state.task);
    const { categories } = useSelector(state => state.category)
    const { labels } = useSelector(state => state.labels)
    const url = useParams();
    const id = url["*"].split("/")[1];
    const CurrentCategory = categories?.find((cat) => cat._id === id);
    const originalTask = mode === "edit" ? selectedTask : null;
    const redirectIfLabelMismatch = useSmartTaskRedirect();

    const dispatch = useDispatch();

    const handleToggleLabel = (label) => {
        dispatch(setSelectedLabels(label));  // Dispatch label toggle action
    };

    const handleSubmit = async () => {
        const now = new Date();

        //  Create Mode
        if (mode === "create") {
            // Validate dates
            if (new Date(startDate) < now) {
                toast.error("Start date must be in the future.");
                return;
            }

            if (new Date(startDate) >= new Date(dueDate)) {
                toast.error("Due date must be after the start date.");
                return;
            }

            try {
                // Create task
                const response = await dispatch(createTask({
                    categoryId: id,
                    labelIds: selectedLabels,
                    title,
                    description,
                    startDate,
                    dueDate,
                    priority,
                    subTasks
                })).unwrap();

                dispatch(pushTaskToLabels({
                    taskId: response._id,
                    labels: response.labels
                  }));
                  
                dispatch(clearTaskForm());
                redirectIfLabelMismatch(id, selectedLabels);
            } catch (error) {
                console.error("Failed to create task:", error);
            }
        }

        //  Edit Mode
        else if (mode === "edit") {
            const isStartDateChanged = startDate !== originalTask.startDate;
            const isDueDateChanged = dueDate !== originalTask.dueDate;

            // Validate dates only if changed
            if (isStartDateChanged && new Date(startDate) < now) {
                toast.error("Start date must be in the future.");
                return;
            }

            if ((isStartDateChanged || isDueDateChanged) && new Date(startDate) >= new Date(dueDate)) {
                toast.error("Due date must be after the start date.");
                return;
            }

            dispatch(updateTask({
                taskId: taskId,
                data: {
                    title,
                    description,
                    startDate,
                    dueDate,
                    priority,
                    labelIds: selectedLabels,
                    subTasks
                }
            }))
                .unwrap()
                .then(() => {
                    dispatch(clearTaskForm());
                    redirectIfLabelMismatch(id, selectedLabels);
                })
                .catch((error) => {
                    console.error("Failed to update task:", error);
                });
        }

        // 🔚 Close the modal/popup after handling
        dispatch(closeForm("taskForm"))
    };

    const handleClose = () => {
        dispatch(clearTaskForm());
        dispatch(closeForm("taskForm"))
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 overflow-auto bg-black bg-opacity-40 flex justify-center items-start pt-10 z-20">
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-white dark:bg-zinc-800  rounded-xl w-full max-w-4xl p-8 shadow-xl border border-zinc-400 dark:border-zinc-600">
                <h2 className="text-2xl font-semibold mb-6 dark:text-zinc-50">{mode === "edit" ? 'Edit Task' : 'Create New Task'}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => dispatch(setTitle(e.target.value))}
                            placeholder="Enter task title"
                            className="w-full border dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Priority</label>
                        <div className="flex space-x-3">
                            {["low", "medium", "high"].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => dispatch(setPriority(level))}
                                    className={`flex items-center  gap-1 px-4 py-2 rounded-md outline-none text-sm font-medium capitalize ${priority === level
                                        ? priorities[level] + " ring-2  ring-purple-500"
                                        : "border dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 border-gray-300 text-gray-600 bg-white"
                                        }`}
                                >
                                    <Flag01Icon size={14} className="shrink-0" />
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Category</label>
                        <select
                            disabled
                            value={CurrentCategory?.name}
                            className="w-full dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 bg-gray-100 text-gray-600 border border-gray-300 rounded-md px-4 py-2"
                        >
                            <option>{CurrentCategory?.name || "Select category"}</option>
                        </select>
                    </div>

                    {/* Labels */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Labels</label>
                        <div className="flex flex-wrap gap-2">
                            {labels?.map((label) => (
                                <label key={label._id} className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 dark:bg-zinc-700 dark:border-zinc-600 rounded-md cursor-pointer text-sm dark:text-zinc-300">
                                    <input
                                        type="checkbox"
                                        className="accent-purple-500"
                                        checked={selectedLabels.includes(label._id)}
                                        onChange={() => handleToggleLabel(label._id)}
                                    />
                                    {label.label_name}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => dispatch(setDescription(e.target.value))}
                            placeholder="Enter task description"
                            rows={4}
                            className="w-full border dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Subtasks */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Subtasks</label>
                        <div className="flex flex-col gap-3">
                            {subTasks.map((task, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={task.title}
                                        onChange={(e) => dispatch(setSubTaskTitle({ index, title: e.target.value }))}
                                        placeholder={`Subtask ${index + 1}`}
                                        className="w-full px-4 py-2 rounded-md border dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
                                    />
                                    <button
                                        onClick={() => dispatch(removeSubTask(index))}
                                        type="button"
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => { dispatch(addSubTask()) }}
                                className="mt-2 text-purple-600 hover:underline text-sm flex items-center gap-1"
                            >
                                <PlusSignIcon size={16} /> Add Subtask
                            </button>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Start Date</label>
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => dispatch(setStartDate(e.target.value))}
                                className="w-full border dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 border-gray-300 rounded-md px-4 py-2 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-zinc-200">End Date</label>
                            <input
                                type="datetime-local"
                                value={dueDate}
                                onChange={(e) => dispatch(setDueDate(e.target.value))}
                                className="w-full border dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 border-gray-300 rounded-md px-4 py-2 shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-8">
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
                        {mode === "create" ? "Create Task" : "Update Task"}
                    </button>

                </div>
            </motion.div>
        </motion.div>
    );
};

export default CreateTaskForm;
