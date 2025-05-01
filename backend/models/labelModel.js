import mongoose from "mongoose";
import taskModel from "./taskModel.js";
import categoryModel from "./categoryModel.js";
const labelSchema = mongoose.Schema({
  label_name: {
      type: String,
      required: true,
  },
  color: {
      type: String,
      required: true,
  },
  category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
  },
  tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
  }],
  user: { // Add user reference
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
  },
}, { timestamps: true });

labelSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
      const tasks = await taskModel.find({ labels: this._id });
      for (const task of tasks) {
          if (task.labels.length === 1 && task.labels[0].toString() === this._id.toString()) {
              await task.deleteOne();
          } else {
              await taskModel.findByIdAndUpdate(task._id, { $pull: { labels: this._id } });
          }
      }

      if (this.category) {
          await categoryModel.findByIdAndUpdate(this.category, { $pull: { labels: this._id } });
      }

      next();
  } catch (err) {
      next(err);
  }
});

const labelModel = mongoose.model('Label', labelSchema);
export default labelModel;
