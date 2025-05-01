import express from 'express'
import { createTask, deleteTaskById, getAllTasks, getTasks,getCalendarTasks,  updateTaskById,TaskStats, getTasksDueToday, toggleSubTask } from '../controllers/task.controller.js'
const router = express.Router()
import verifyAuth from "../middlewares/verifyAuth.js";

router.post('/',verifyAuth, createTask)
router.get('/',verifyAuth, getTasks)
router.get('/calendar-tasks',verifyAuth, getCalendarTasks)
router.get('/tasks-due-today',verifyAuth, getTasksDueToday)
router.put('/:id',verifyAuth, updateTaskById)
router.put('/:taskId/subTasks/:subTaskId', verifyAuth, toggleSubTask)
router.delete('/:id',verifyAuth, deleteTaskById)
router.get('/stats',verifyAuth, TaskStats)



export default router;