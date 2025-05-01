import express from 'express'
const router = express.Router();
import {
  createCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById
} from "../controllers/category.controller.js"
import verifyAuth from "../middlewares/verifyAuth.js";


// Routes
router.post("/",verifyAuth, createCategory);
router.get("/", verifyAuth, getAllCategories);
router.put("/:id",verifyAuth, updateCategoryById);
router.delete("/:id",verifyAuth, deleteCategoryById);

export default router;
