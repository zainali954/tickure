import mongoose from "mongoose";
import labelModel from "./labelModel.js";
import taskModel from "./taskModel.js";
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    labels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
    }],
    user: { // Add user reference
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

categorySchema.pre('deleteOne', { document: true, query: false }, async function () {
    const categoryId = this._id;
    await labelModel.deleteMany({ category: categoryId });
    await taskModel.deleteMany({ category: categoryId });
});

const categoryModel = mongoose.model('Category', categorySchema);
export default categoryModel;
