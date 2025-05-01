import express from 'express'
import verifyAuth from '../middlewares/verifyAuth.js';
import { banUser, deleteUser, getAllUsers, searchUsers, userStats, verifyUser } from '../controllers/user.controller.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';

const adminUserRouter = express.Router()

// admin
adminUserRouter.get('/', verifyAuth, verifyAdmin, getAllUsers)
adminUserRouter.get('/search', verifyAuth, verifyAdmin, searchUsers)
adminUserRouter.get('/stats', verifyAuth, verifyAdmin, userStats)
adminUserRouter.put('/:id/verify', verifyAuth, verifyAdmin, verifyUser)
adminUserRouter.put('/:id/ban', verifyAuth, verifyAdmin, banUser)
adminUserRouter.delete('/:id', verifyAuth, verifyAdmin, deleteUser)
export default adminUserRouter;