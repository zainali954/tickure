import mongoose from "mongoose";
import categoryModel from "../models/categoryModel.js";
import labelModel from "../models/labelModel.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a new label
export const createLabel = asyncHandler(async (req, res) => {
    const { categoryId, label_name } = req.body;

    if (!categoryId) {
        throw new apiError(400, "Without selecting a category, you cannot create a label.");
    }

    if (!label_name) {
        throw new apiError(400, "A name is required to create a label.");
    }

    const existingCategory = await categoryModel.findOne({ _id: categoryId, user: req.user_id });
    if (!existingCategory) {
        throw new apiError(400, "Category not found or access denied.");
    }

    const existingLabel = await labelModel.findOne({ label_name, category: categoryId, user: req.user_id });
    if (existingLabel) {
        throw new apiError(400, "A label with the same name already exists in this category.");
    }

    const newLabel = await labelModel.create({
        label_name,
        color: existingCategory.color,
        category: categoryId,
        user: req.user_id
    });

    existingCategory.labels.push(newLabel._id);
    await existingCategory.save();

    apiResponse.success(res, "Label created successfully", newLabel, 201);
});

// Get all labels
export const getAllLabels = asyncHandler(async (req, res) => {
    const labels = await labelModel.find({ user: req.user_id }).select('-__v');
    apiResponse.success(res, "Fetched Successfully.", labels, 200);
});

// Get all labels of a particular Category
export const getLabelsByCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new apiError(400, "Category ID is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new apiError(400, "Invalid Category ID.");
    }

    const labels = await labelModel.find({ category: id, user: req.user_id });

    apiResponse.success(res, "Fetched Successfully.", labels, 200);
});

// Update a label by ID
export const updateLabelById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { label_name } = req.body;

    if (!id) {
        throw new apiError(400, "Label ID is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new apiError(400, "Invalid Label ID.");
    }

    if (!label_name) {
        throw new apiError(400, "Label name cannot be empty.");
    }

    const label = await labelModel.findOne({ _id: id, user: req.user_id });
    if (!label) {
        throw new apiError(404, "Label not found or access denied.");
    }

    if (label.label_name === label_name) {
        throw new apiError(400, "No changes detected; the label name is already the same.");
    }

    const duplicateLabel = await labelModel.findOne({
        label_name,
        category: label.category,
        user: req.user_id
    });
    if (duplicateLabel && duplicateLabel._id.toString() !== id) {
        throw new apiError(400, "A label with the same name already exists in this category.");
    }

    label.label_name = label_name;
    const updatedLabel = await label.save();

    apiResponse.success(res, "Label updated successfully.", updatedLabel, 200);
});

// Delete a label by ID
export const deleteLabelById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new apiError(404, "Label ID is required to delete this label.");
    }

    const label = await labelModel.findOne({ _id: id, user: req.user_id });
    if (!label) {
        throw new apiError(404, "Label not found or access denied.");
    }

    await label.deleteOne();
    apiResponse.success(res, "Label deleted successfully.", {}, 200);
});
