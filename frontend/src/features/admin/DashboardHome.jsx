import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useSelector } from 'react-redux';

const DashboardHome = () => {

  // Default dailyTaskData to an empty array so .map() never breaks
  const {
    taskStats = {},
    categoryStats = 0,
    labelStats = 0,
    activeUsers = {},
  } = useSelector((state) => state.stats);
  const {user} = useSelector(state => state.auth)

  // inside DashboardHome
  const rawDaily = useSelector((state) => state.stats.dailyTaskData);
  const dailyTaskData = Array.isArray(rawDaily) ? rawDaily : [];


  const taskPieOption = {
    title: { text: 'Task Status Breakdown', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Tasks',
        type: 'pie',
        radius: '60%',
        data: [
          { value: taskStats.completed || 0, name: 'Completed', itemStyle: { color: '#16a34a' } },
          { value: taskStats.inProgress || 0, name: 'In Progress', itemStyle: { color: '#2563eb' } },
          { value: taskStats.overdue || 0, name: 'Overdue', itemStyle: { color: '#dc2626' } },
          { value: taskStats.upcoming || 0, name: 'Upcoming / Not Started', itemStyle: { color: '#6b7280' } },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  const taskLineOption = {
    title: { text: 'Daily Task Creation' },
    xAxis: {
      type: 'category',
      data: dailyTaskData.map((item) => item.date),
    },
    yAxis: { type: 'value' },
    series: [
      {
        data: dailyTaskData.map((item) => item.count),
        type: 'line',
        smooth: true,
      },
    ],
  };

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100">
          Welcome{user.name ? `, ${user.name}` : ''}! 👋
        </h2>
        <p className="text-gray-600 dark:text-zinc-400">
          Here’s an overview of your productivity.
        </p>
      </div>
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Total Tasks" value={taskStats.total || 0} />
        <StatCard title="Total Categories" value={categoryStats} />
        <StatCard title="Total Labels" value={labelStats} />
        <StatCard title="Active Users Today" value={activeUsers.today || 0} />
        <StatCard title="Active Users This Week" value={activeUsers.thisWeek || 0} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard option={taskPieOption} />
        <ChartCard option={taskLineOption} />
      </div>
    </div>
  );
};

// Small helper components to keep JSX DRY
const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 p-4 text-center rounded-lg shadow">
    <h3 className="text-lg font-thin text-gray-600 dark:text-zinc-300">{title}</h3>
    <p className="text-2xl font-bold dark:text-zinc-200">{value}</p>
  </div>
);

const ChartCard = ({ option }) => (
  <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 p-4 rounded-lg shadow">
    <ReactECharts option={option} style={{ height: '300px' }} />
  </div>
);

export default DashboardHome;
