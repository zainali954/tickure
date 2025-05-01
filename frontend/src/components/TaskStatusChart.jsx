// components/TaskStatusChart.jsx
import ReactECharts from "echarts-for-react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";

export default function TaskStatusChart() {
  const { stats } = useSelector((state) => state.task);
  const { completedTasks, inProgressTasks, overdueTasks, upCommingTasks  } = stats;

  const chartOptions = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: {
        color: "#888", // Light by default, override using CSS in dark mode
      },
    },
    series: [
        {
          name: "Tasks",
          type: "pie",
          radius: ["50%", "70%"], // Donut shape
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: "{b}: {c} ({d}%)",
            color: "#aaa",
          },
          labelLine: {
            show: true,
          },
          data: [
            {
              value: completedTasks,
              name: "Completed",
              itemStyle: {
                color: "#22c55e",
                borderRadius: 10, // Rounded corner
              },
            },
            {
              value: inProgressTasks,
              name: "In Progress",
              itemStyle: {
                color: "#3b82f6",
                borderRadius: 10,
              },
            },
            {
              value: upCommingTasks,
              name: "upComing",
              itemStyle: {
                color: "#f59e0b",
                borderRadius: 10,
              },
            },
            {
              value: overdueTasks,
              name: "Overdue",
              itemStyle: {
                color: "#ef4444",
                borderRadius: 10,
              },
            },
          ],
        },
      ],
      
  };

  return (
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
    className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Task Status Overview
      </h3>
      <ReactECharts
        option={chartOptions}
        style={{ height: "300px", width: "100%" }}
        theme="light"
      />
    </motion.div>
  );
}
