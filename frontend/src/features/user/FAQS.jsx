import React, { useState } from 'react';
import { ArrowDown01Icon, ArrowUp01Icon } from 'hugeicons-react';
import { motion, AnimatePresence } from 'motion/react';


const faqs = [
    {
        question: 'Why am I redirected to a different label after creating a task?',
        answer:
            'If you select a different label while creating a task, the app navigates you to that label’s view to help you keep track of the task contextually.',
    },
    {
        question: 'Can I create a task without a label?',
        answer:
            'No. Each task must be associated with a label. Labels help organize tasks within a specific category for better productivity.',
    },
    {
        question: 'How do categories and labels differ?',
        answer:
            'Categories are broader groups (like projects or areas), while labels are specific tags (like priority or type) within a category.',
    },
    {
        question: 'What happens if I delete a label?',
        answer:
            'Deleting a label will also delete all tasks associated with it. A confirmation popup will show the number of affected tasks before deletion.',
    },
    {
        question: 'Is there an undo feature after deleting a task or label?',
        answer:
            'Currently, there’s no undo. Be careful with delete actions — confirmation dialogs are added for safety.',
    },
    {
        question: 'What do the colored task statuses mean?',
        answer:
            'Green means completed, yellow is in-progress, red is overdue, and gray is upcoming. These help visualize task status quickly.',
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleIndex = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-white p-6 rounded-2xl mt-4 dark:bg-zinc-950 ">
        <div className="max-w-3xl mx-auto ">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
                Frequently Asked Questions
            </h2>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 dark:border-zinc-700 rounded-xl"
                    >
                        <button
                            onClick={() => toggleIndex(index)}
                            className="w-full flex justify-between items-center p-4 text-left text-gray-700 dark:text-gray-100 font-medium"
                        >
                            <span>{faq.question}</span>
                            {openIndex === index ? (
                                <ArrowUp01Icon className="w-5 h-5" />
                            ) : (
                                <ArrowDown01Icon className="w-5 h-5" />
                            )}
                        </button>

                        <AnimatePresence initial={false}>
                            {openIndex === index && (
                                <motion.div
                                    key="answer"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default FAQ;