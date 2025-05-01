import mongoose, { ObjectId } from "mongoose";
import categoryModel from "../models/categoryModel.js";
import labelModel from "../models/labelModel.js";
import taskModel from "../models/taskModel.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Helper function for validating ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new task
export const createTask = asyncHandler(async (req, res) => {
  const { categoryId, labelIds, title, description, startDate, dueDate, status, priority, subTasks } = req.body;
  // Step 1: Validate inputs
  if (!categoryId) {
    throw new apiError(400, "Category ID is required to create a task.");
  }

  if (!labelIds || !labelIds.length) {
    throw new apiError(400, "At least one label is required to create a task.");
  }
  if (!title) {
    throw new apiError(400, "Task title is required.");
  }
  const now = new Date()
  if (new Date(startDate) < now) {
    throw new apiError(400, "Start date must be in the future.");
  }
  if (new Date(startDate) >= new Date(dueDate)) {
    throw new apiError(400, "Due date must be after the start date.");
  }

  // Step 2: Fetch the category
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    throw new apiError(400, "Category not found.");
  }

  const invalidLabels = labelIds.filter(labelId => !category.labels.includes(labelId));
  if (invalidLabels.length > 0) {
    throw new apiError(400, `Invalid labels provided`);
  }

  const UpdatedStatus = getTaskStatus({
    startDate: startDate,
    dueDate: dueDate
  });

  // Step 3: Create the task
  const newTask = await taskModel.create({
    title,
    description,
    category: categoryId,
    labels: labelIds,
    startDate,
    dueDate,
    status: UpdatedStatus,
    priority: priority || "low",
    user: req.user_id,
    subTasks
  });

  // Step 4: Update each label with the new task ID
  await labelModel.updateMany(
    { _id: { $in: labelIds } },
    { $push: { tasks: newTask._id } }
  );

  const populatedTask = await taskModel.findById(newTask).populate('labels')

  // Step 5: Respond with success
  apiResponse.success(res, "Task created successfully", populatedTask, 201);
});

// Get all tasks
export const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await taskModel.find({ user: req.user_id });
  if (!tasks.length) {
    throw new apiError(404, 'Tasks not found.');
  }

  apiResponse.success(res, "Fetched Successfully.", tasks, 200);
});

export const getTasks = asyncHandler(async (req, res) => {
  const {
    status, isPinned, startDate, dueDate, labelId, categoryId, priority, search,
    sortBy = "startDate", sortOrder = "asc", page = 1,  limit = 10, 
  } = req.query;

  if (categoryId && !isValidObjectId(categoryId)) {
    throw new apiError(400, "Failed to load Tasks. Invalid Id.");
  }

  await taskModel.updateMany(
    {
      user: req.user_id,
      dueDate: { $lt: new Date() },
      status: { $in: ["Not Started", "In Progress"] }
    },
    { $set: { status: "Overdue" } }
  );

  const filter = {};

  if (status) filter.status = status;
  if (isPinned !== undefined) filter.isPinned = isPinned === "true";
  if (priority) filter.priority = priority;
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [
      { title: { $regex: searchRegex } },
      { description: { $regex: searchRegex } }
    ];
  }

  // Date filters
  if (startDate || dueDate) {
    filter.$and = [];
    if (startDate) filter.$and.push({ startDate: { $gte: new Date(startDate) } });
    if (dueDate) filter.$and.push({ dueDate: { $lte: new Date(dueDate) } });
  }

  if (labelId) filter.labels = { $in: [labelId] };
  if (categoryId) filter.category = categoryId; // Add categoryId filter
  filter.user = req.user_id;

  // Pagination
  const skip = (page - 1) * limit;  // skip based on current page and limit

  // Sorting options
  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  // Query the database with filters, sorting, and pagination
  const tasks = await taskModel.find(filter)
    .sort(sortOptions)  // Apply dynamic sorting
    .skip(skip)         // Skip tasks based on page number
    .limit(Number(limit)) // Limit the number of tasks per page
    .select("-__v") // Exclude '__v' from the main task document
    .populate([
      {
        path: "labels", // Path to populate
        select: "label_name color" // Include only 'label_name' and exclude '_id' in the populated labels
      },
    ]);

  // Get the total number of tasks for pagination info
  const totalTasks = await taskModel.countDocuments(filter);

  if (!tasks.length) {
    return apiResponse.success(
      res,
      "No tasks found for the given criteria.",
      {},
      200
    );
  }

  // Return the tasks along with pagination details
  apiResponse.success(res, "Fetched Successfully.", {
    tasks,
    pagination: {
      totalTasks,
      currentPage: Number(page),
      totalPages: Math.ceil(totalTasks / limit),  // Total number of pages
      pageSize: Number(limit),  // Number of tasks per page
    },
  }, 200);
});

export const getCalendarTasks = asyncHandler(async (req, res) => {
  const { categoryId, labelId, startDate, endDate, status, priority, search } = req.query;



  // Validate and parse dates
  const start = startDate ? moment(startDate).startOf('day') : null;
  const end = endDate ? moment(endDate).endOf('day') : null;

  // Build the query
  const query = {};

  query.user= req.user_id;
  if (categoryId) {
    query.category = new mongoose.Types.ObjectId(categoryId);
  }

  if (labelId) {
    query.labels = { $in: [new mongoose.Types.ObjectId(labelId)] };
  }

  if (status) {
    query.status = status;
  }
  
  if (priority) {
    query.priority = priority;
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { title: { $regex: searchRegex } },
      { description: { $regex: searchRegex } }
    ];
  }

  if (start && end) {
    query.dueDate = { $gte: start.toDate(), $lte: end.toDate() };
  }

  // Fetch tasks matching the filters with sorting
  const tasks = await taskModel.find(query).sort({startDate: 1});

  // Respond
  apiResponse.success(res, "Fetched Successfully.", tasks, 200);
});


export const toggleSubTask = asyncHandler(async (req, res) => {
  const { taskId, subTaskId } = req.params

  const task = await taskModel.findById(taskId)
  if (!task) throw new apiError(404, "Task not found.");

  const subTask = task.subTasks.id(subTaskId)
  if (!subTask) throw new apiError(404, "Subtask not found.");

  subTask.isCompleted = !subTask.isCompleted;

  const allCompleted = task.subTasks.every(t => t.isCompleted);
  const noneCompleted = task.subTasks.every(t => !t.isCompleted);
  const now = new Date();

  if (allCompleted) {
    task.status = "Completed";
  } else {
    if (noneCompleted && now < task.startDate) {
      task.status = "Not Started";
    } else if (now > task.dueDate) {
      task.status = "Overdue";
    } else {
      task.status = "In Progress";
    }
  }


  await task.save();
  apiResponse.success(res, `Subtask "${subTask.title}" marked as ${subTask.isCompleted ? 'completed' : 'incomplete'}.`, task, 200)
})

export const updateTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title, description, startDate, dueDate, status, isPinned, priority, labelIds: labels, subTasks } = req.body;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new apiError(400, "Invalid or missing Task ID.");
  }

  const task = await taskModel.findOne({ _id: id, user: req.user_id });
  if (!task) {
    throw new apiError(404, "Task not found.");
  }

  if (
    title === undefined &&
    description === undefined &&
    startDate === undefined &&
    dueDate === undefined &&
    status === undefined &&
    isPinned === undefined &&
    priority === undefined
  ) {
    throw new apiError(400, "At least one field is required to update the task.");
  }
  

  const updateFields = {
    ...(title && { title }),
    ...(description && { description }),
    ...(startDate && { startDate }),
    ...(dueDate && { dueDate }),
    ...(status && { status }),
    ...(isPinned !== undefined && { isPinned }),
    ...(priority && { priority }),
    ...(labels && { labels }),
    ...(subTasks && {subTasks})
  };

  Object.assign(task, updateFields);

  // ✅ If status is Completed, mark all subtasks as completed too
  if (status === "Completed" && task.subTasks?.length > 0) {
    task.subTasks.forEach(sub => {
      sub.isCompleted = true;
    });
  }

  const updatedTask = await task.save();
  const populatedTask = await taskModel.findById(updatedTask._id).populate("labels");

  apiResponse.success(res, "Task updated successfully.", populatedTask, 200);
});


export const deleteTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    throw new apiError(400, "Invalid Task ID.");
  }

  const task = await taskModel.findById(id);

  if (!task) {
    throw new apiError(404, "Task not found.");
  }

  // Check if the task belongs to the logged-in user
  if (task.user.toString() !== req.user_id) {
    throw new apiError(403, "Unauthorized: You cannot delete this task.");
  }

  // Remove the task reference from all labels' tasks array
  await labelModel.updateMany(
    { tasks: id },
    { $pull: { tasks: id } }
  );

  await taskModel.findByIdAndDelete(id);

  apiResponse.success(res, "Task deleted successfully.", id, 200);
});

export const TaskStats = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user_id);


  const completedTasks = await taskModel.countDocuments({
    user: userId,
    status: "Completed",
  });

  const upCommingTasks = await taskModel.countDocuments({
    user: userId,
    status: "Not Started",
  });

  const inProgressTasks = await taskModel.countDocuments({
    user: userId,
    status: "In Progress",
  });

  const overdueTasks = await taskModel.countDocuments({
    user: userId,
    status: "Overdue",
  });

  const totalTasks = completedTasks + upCommingTasks + inProgressTasks + overdueTasks


  const stats = await taskModel.aggregate([
    {
      $match: {
        user: userId,
        category: { $ne: null }, // Ensure category exists
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
        },
        upComing: {
          $sum: { $cond: [{ $eq: ["$status", "Not Started"] }, 1, 0] },
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
        },
        overdue: {
          $sum: { $cond: [{ $eq: ["$status", "Overdue"] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: "categories", // Ensure this is correct
        localField: "_id",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $unwind: {
        path: "$categoryDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        name: "$categoryDetails.name",
        createdAt: "$categoryDetails.createdAt",
        color: "$categoryDetails.color",
        total: 1,
        completed: 1,
        upComing:1,
        inProgress: 1,
        overdue: 1,
      },
    },
  ]);

  const result = {
    totalTasks,
    completedTasks,
    upCommingTasks,
    inProgressTasks,
    overdueTasks,
    stats,
  };

  return apiResponse.success(res, "Fetched Successfully.", result, 200);
});

import moment from 'moment'
import { getTaskStatus } from "../utils/getTasksStatus.js";

export const getTasksDueToday = asyncHandler(async (req, res) => {
  const userId = req.user_id

  // Define today's start and end time using moment.js
  const startOfDay = moment().startOf("day").toDate();
  const endOfDay = moment().endOf("day").toDate();

  const tasks = await taskModel.find({
    user: userId,
    dueDate: { $gte: startOfDay, $lte: endOfDay },
  })
    .populate('category')
    .sort({ dueDate: 1 });

  return apiResponse.success(res, "Fetched Successfully.", tasks, 200);
})



