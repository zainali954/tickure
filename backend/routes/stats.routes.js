// routes/adminAnalytics.js
import express from  'express';
const router = express.Router();
import {fetchStats} from "../controllers/stats.controller.js"

// GET /api/admin/analytics
router.get('/', fetchStats );

export default router;
