import mongoose from "mongoose";
import categoryModel from "../models/categoryModel.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a new category
export const createCategory = asyncHandler(async (req, res) => {
    const { name, color } = req.body;

    if (!name || !color) {
        throw new apiError(400, "Category name and color are required");
    }

    const existingCategory = await categoryModel.findOne({ name, user:req.user_id });
    if (existingCategory) {
        throw new apiError(400, "Category with this name already exists");
    }

    const category = await categoryModel.create({
        name,
        color,
        labels: [], // Empty array for labels
        user : req.user_id
    });
    

    if (!category) {
        throw new apiError(500, "Failed to create category, try again");
    }

    apiResponse.success(
        res,
        "Category created successfully",
        category,
        201
    );
});


// Get all categories
export const getAllCategories = asyncHandler(async(req, res) => {
    
    const categories = await categoryModel.find({user : req.user_id}).populate('labels','label_name color').select('-__v')
    if(!categories || categories.length === 0){
        return apiResponse.success(res, "No categories found.")
    }

    apiResponse.success(
        res,
        "Fetched Successfully.",
        categories,
        200
    )
})


// Update a category by ID
export const updateCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, color } = req.body;

    if (!id) {
        throw new apiError(404, "Category id is required to update this category.");
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new apiError(400, "The provided Category ID is invalid.");
    }

    if (!name && !color) {
        throw new apiError(400, "At least one field (name or color) is required to update the category.");
    }

    // Check if category exists and belongs to the logged-in user
    const category = await categoryModel.findOne({ _id: id, user: req.user_id });
    if (!category) {
        throw new apiError(404, "Category not found or access denied.");
    }

    if (name && category.name === name) {
        throw new apiError(400, "No changes detected; the category name is already the same.");
    }

    if (name) {
        const existingCategory = await categoryModel.findOne({ name, user: req.user_id });
        if (existingCategory && existingCategory._id.toString() !== id) {
            throw new apiError(400, "A category with the same name already exists.");
        }
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (color) updateFields.color = color;

    const updatedCategory = await categoryModel.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true }
    );
    if (!updatedCategory) {
        throw new apiError(404, "Category Not Found.");
    }
    apiResponse.success(
        res,
        "Updated successfully.",
        updatedCategory,
        200
    );
});

// Delete a category by ID
export const deleteCategoryById = asyncHandler(async(req, res) => {
    const { id } = req.params
    if(!id){
        throw new apiError(404, "Category id is required to delete this category.")
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new apiError(400, "Invalid id");
    }    

    const category = await categoryModel.findOne({_id : id, user:req.user_id})
    if(!category){
        throw new apiError(404, "Category Not Found.")
    }
    await category.deleteOne() //trigger pre deleteOne hook
    apiResponse.success(
        res,
        "Deleted successfully.",
        {},
        200
    )
}) 
