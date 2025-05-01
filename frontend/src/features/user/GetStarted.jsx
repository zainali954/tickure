import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleGuide } from '../../app/slices/uiSlice';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Create a Category',
    description:
      'Go to the sidebar and click on "Create Category" to organize your tasks into logical groups.',
    tip: 'Categories help group related tasks for better focus.',
    imageDark:
      'https://res.cloudinary.com/dyt6y8t5r/image/upload/v1745920415/s1dark_vcpawj.png',
    imageLight: 'https://res.cloudinary.com/dyt6y8t5r/image/upload/v1745920416/s1_jd0nni.png'

  },
  {
    title: 'Add Labels',
    description:
      'Select a category and click "Create Label" to define task-specific labels.',
    tip: 'Labels help organize by priority, status, or type.',
    imageDark:
      'https://res.cloudinary.com/dyt6y8t5r/image/upload/v1745920417/s2dark_ns1xiw.png',
    imageLight: 'https://res.cloudinary.com/dyt6y8t5r/image/upload/v1745920416/s2_djvfgr.png'
  },
  {
    title: 'Create a Task',
    description:
      'Choose a label and click "Create Task" to add your task under the selected label.',
    tip: 'Add due dates, priority, and descriptions to make tasks actionable.',
    imageDark:
      'https://res.cloudinary.com/dyt6y8t5r/image/upload/v1745920416/s3dark_hhkykq.png',
      imageLight: 'https://res.cloudinary.com/dyt6y8t5r/image/upload/v1745920416/s3_gi5xu0.png'
  },
];

const GetStarted = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch();

  const next = () => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const prev = () => currentStep > 0 && setCurrentStep(currentStep - 1);
  const finish = () => dispatch(toggleGuide());
const [mode, setmode] = useState(localStorage.getItem('theme'))

  

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>

      <div className="relative z-20 w-[95%] max-w-5xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 md:p-10 space-y-6 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Get Started
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">
              Your {steps.length}-step journey to productivity
            </p>
          </div>
          <button
            onClick={finish}
            className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
          >
            Skip Tutorial
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center items-center gap-3">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-3 w-12 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'bg-purple-600'
                  : idx < currentStep
                  ? 'bg-purple-300 dark:bg-purple-700/60'
                  : 'bg-gray-300 dark:bg-zinc-700'
              }`}
            ></div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row bg-purple-50 dark:bg-zinc-800 rounded-xl overflow-hidden"
          >
            {/* Text */}
            <div className="p-6 md:w-1/2 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
                <span className="inline-flex items-center justify-center bg-purple-600 text-white w-8 h-8 rounded-full mr-3">
                  {currentStep + 1}
                </span>
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {steps[currentStep].description}
              </p>
              <div className="bg-purple-100 dark:bg-purple-900 border-l-4 border-purple-500 p-4 rounded-lg text-purple-800 dark:text-purple-200 text-sm">
                💡 {steps[currentStep].tip}
              </div>
            </div>

            {/* Image */}
            <div className="md:w-1/2 flex items-center justify-center bg-purple-100 dark:bg-zinc-700 p-4">
              <img
                src={mode === "dark" ? steps[currentStep].imageDark : steps[currentStep].imageLight}
                alt="Step visual"
                className="rounded-lg object-cover h-60 w-full"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prev}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-lg border font-medium transition-all ${
              currentStep === 0
                ? 'text-gray-400 border-gray-300 dark:border-zinc-600 cursor-not-allowed'
                : 'text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-500 hover:bg-purple-50 dark:hover:bg-zinc-800'
            }`}
          >
            ← Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={next}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={finish}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              Get Started
            </button>
          )}
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
          Need help? Check our{' '}
          <Link to={'/user/dashboard/faqs'} className="text-purple-600 dark:text-purple-400 hover:underline">
            documentation
          </Link>{' '}
          or{' '}
          <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
            contact support
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
