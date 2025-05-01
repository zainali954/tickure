import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCategoryForm,
  createCategory,
  setCategoryName,
  setColor,
  updateCategory,
} from '../../app/slices/categorySlice';
import { closeForm } from '../../app/slices/uiSlice';
import { motion } from 'motion/react';

const CreateCategoryForm = () => {
  const categoryName = useSelector((state) => state.category.name);
  const selectedColor = useSelector((state) => state.category.color);
  const { mode, id: categoryId } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  const colors = [
    '#A47E42', '#9B7EBD', '#009688', '#795548', '#ADA397', '#D2797F',
    '#8BC34A', '#BD5734', '#C08552', '#9E9E1C', '#FFAB91', '#607D8B',
  ];

  const onClose = () => {
    dispatch(closeForm('categoryForm'));
  };

  (categoryName, selectedColor, mode)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName && (mode === "edit" || selectedColor)) {
      if (mode === 'create') {
        dispatch(createCategory({ name: categoryName, color: selectedColor }));
      } else {
        dispatch(updateCategory({ id: categoryId, name: categoryName })); // no color in update
      }
      dispatch(clearCategoryForm());
      onClose();
    } else {
      alert("Please fill out the category name.");
    }
  };

  const handleClose = () => {
    dispatch(clearCategoryForm());
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full md:w-96 border dark:border-zinc-700">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-700 dark:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h3 className="font-semibold text-xl dark:text-gray-300 mb-2">
          {mode === 'edit' ? 'Update Category' : 'Create Category'}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Info Note */}
          <div className="mb-4 text-sm text-yellow-700 bg-yellow-100 border border-yellow-300 dark:text-yellow-100 dark:bg-yellow-900 dark:border-yellow-700 p-3 rounded-md">
            You cannot change the color of a category once it’s created.
          </div>

          {/* Category Name Input */}
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              placeholder="Category Name"
              className="w-full mt-2 border dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={categoryName}
              onChange={(e) => dispatch(setCategoryName(e.target.value))}
              required
            />
          </div>

          {/* Color Selection - Only in Create Mode */}
          {mode === 'create' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Choose Category Color
              </label>
              <div className="grid grid-cols-6 gap-4">
                {colors.map((color, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="categoryColor"
                      value={color}
                      className="hidden"
                      checked={selectedColor === color}
                      onChange={() => dispatch(setColor(color))}
                    />
                    <span
                      className={`w-8 h-8 rounded-full cursor-pointer border-2 ${selectedColor === color ? 'border-black' : 'border-transparent'
                        }`}
                      style={{ backgroundColor: color }}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 mt-2"
          >
            {mode === 'create' ? 'Create Category' : 'Update Category'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateCategoryForm;
