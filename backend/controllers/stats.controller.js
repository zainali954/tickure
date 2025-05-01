import Task from '../models/taskModel.js';
import Category from '../models/categoryModel.js';
import Label from '../models/labelModel.js';
import User from '../models/userModel.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';

// Utility to get start of today and start of week
const getStartOfToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};
const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when Sunday
    return new Date(now.getFullYear(), now.getMonth(), diff);
};

// GET /api/admin/analytics
export const fetchStats = asyncHandler(
    async (req, res, next) => {

        // Task counts by status
        const total = await Task.countDocuments();
        const completed = await Task.countDocuments({ status: 'Completed' });
        const inProgress = await Task.countDocuments({ status: 'In Progress' });
        const overdue = await Task.countDocuments({ dueDate: { $lt: new Date() } });
        const upcoming = await Task.countDocuments({ startDate: { $gt: new Date() } });

        // Category and Label counts
        const categoryStats = await Category.countDocuments();
        const labelStats = await Label.countDocuments();

        // Active users
        const todayStart = getStartOfToday();
        const weekStart = getStartOfWeek();
        const activeUsersToday = await User.countDocuments({ lastLogin: { $gte: todayStart } });
        const activeUsersWeek = await User.countDocuments({ lastLogin: { $gte: weekStart } });

        // Daily task creation for last 7 days
        const past7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            past7Days.push(date);
        }

        const dailyTaskData = await Task.aggregate([
            {
                $match: {
                    createdAt: { $gte: past7Days[0] }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Format into continuous list
        const formattedDaily = past7Days.map((day) => {
            const key = day.toISOString().slice(0, 10);
            const entry = dailyTaskData.find(d => d._id === key);
            return { date: key, count: entry ? entry.count : 0 };
        });

        apiResponse.success(
            res,
            "Fetched Successfully!",
            {
                taskStats: { completed, inProgress, overdue, upcoming, total },
                categoryStats,
                labelStats,
                activeUsers: { today: activeUsersToday, thisWeek: activeUsersWeek },
                dailyTaskData: formattedDaily
            },
            200
        )
    }
);
