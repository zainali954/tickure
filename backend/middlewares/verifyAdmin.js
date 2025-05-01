import userModel from "../models/userModel.js";
import apiError from "../utils/apiError.js";

const verifyAdmin = async(req, res, next) => {
    const user = await userModel.findById(req.user_id)
    if (!user) {
        return next(new apiError(401, "Unauthorized. Please log in."));
    }

    if (user.role !== "admin") {
        return next(new apiError(403, "Access denied. You must be an admin to perform this action."));
    }

    next();
};

export default verifyAdmin;