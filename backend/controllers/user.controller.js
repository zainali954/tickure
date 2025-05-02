import { Mongoose } from "mongoose";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import User from "../models/userModel.js"

export const getCurrentUserDetails = asyncHandler(async(req, res)=>{
    const user = await User.findById(req.user_id)

    apiResponse.success(res, "Fetched successfully!", user, 200)

})

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });

    if (!users.length) {
        return apiResponse.success(res, "No user found.", users, 200);
    }

    apiResponse.success(res, "Fetched successfully.", users, 200);
});

// 🔍 Search Users
export const searchUsers = asyncHandler(async (req, res) => {
    const { id, name, email, status } = req.query;
    let filter = {};

    if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new apiError(400, "Invalid User ID format." );
        }
        filter._id = id;
    }
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (status === 'verified') filter.isVerified = true;
    if (status === 'unverified') filter.isVerified = false;
    if (status === 'banned') filter.isBanned = true;

    const users = await User.find(filter);
    if(!users.length){ return apiResponse.success(res, "No User found.", users, 200)};

    apiResponse.success(res, "Fetched successfully.", users, 200);
})

// user Stats
// 📊 User Stats Route
export const userStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = totalUsers - verifiedUsers;
    const newUsers = await User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
    const bannedUsers = await User.countDocuments({ isBanned: true });

    apiResponse.success(res, "Fetched Successfully!", { totalUsers, verifiedUsers, unverifiedUsers, newUsers, bannedUsers }, 200)
});

// ✅ Verify User
export const verifyUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new apiError(404, "User not found.");

    user.isVerified = true;
    await user.save();

    apiResponse.success(res, "User verified successfully", user, 200)
});

// 🚫 Ban/Suspend User
export const banUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new apiError(404, "User not found.");

    user.isBanned = !user.isBanned;
    await user.save();
    apiResponse.success(res, `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`, user, 200);
});

// 🗑️ Delete User
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new apiError(404, "User not found.");

    await user.deleteOne();

    apiResponse.success(res, 'User deleted successfully', req.params.id);
});