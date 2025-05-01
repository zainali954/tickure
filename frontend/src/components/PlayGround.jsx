// PlayGround.jsx
import { motion } from "motion/react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

const cards = [
  { title: "Total Tasks", value: 50 },
  { title: "Completed", value: 32 },
  { title: "Overdue", value: 5 },
];

const PlayGround = () => (
  <motion.div
    variants={container}
    initial="hidden"
    animate="show"
    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
  >
    {cards.map((card, i) => (
      <motion.div
        key={i}
        variants={cardVariant}
        className="p-4 bg-white dark:bg-zinc-800 shadow rounded-xl"
      >
        <h3 className="text-lg font-semibold">{card.title}</h3>
        <p className="text-2xl mt-2">{card.value}</p>
      </motion.div>
    ))}
  </motion.div>
);

export default PlayGround;
