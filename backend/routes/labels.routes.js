import express from 'express'
const router = express.Router();
import {
  createLabel,
  deleteLabelById,
  getAllLabels,
  getLabelsByCategory,
  updateLabelById
} from "../controllers/label.controller.js"
import verifyAuth from "../middlewares/verifyAuth.js";

// Routes
router.post("/", verifyAuth, createLabel);
router.get("/", verifyAuth, getAllLabels);
router.get("/:id", verifyAuth, getLabelsByCategory);
router.put("/:id", verifyAuth, updateLabelById);
router.delete("/:id", verifyAuth, deleteLabelById);

export default router;
