import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const formatTime = (date) =>
  date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

const formatDate = (date) =>
  date.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const Clock = () => {
  const [time, setTime] = useState(formatTime(new Date()));
  const [date, setDate] = useState(formatDate(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(formatTime(now));
      setDate(formatDate(now));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="text-lg font-semibold text-gray-800 dark:text-white">{time}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{date}</div>
    </motion.div>
  );
};

export default Clock;
