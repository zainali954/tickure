import mongoose from "mongoose";
const taskSchema = mongoose.Schema({
  title: {
      type: String,
      required: true,
  },
  description: {
      type: String,
  },
  category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
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
  startDate: { type: Date },
  dueDate: { type: Date },
  status: { 
      type: String, 
      enum: ["Not Started", "In Progress", "Completed", "Overdue"], 
  },
  priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
  },
  isPinned: { type: Boolean, default: false },
  subTasks: [
    {
      title: { type: String, required: true },
      isCompleted: { type: Boolean, default: false },
    },
  ],
}, { timestamps: true });

// taskSchema.pre('save', function (next) {
//   const now = new Date();

//   if (this.status !== "Completed") {
//       if (this.startDate && now < this.startDate) {
//           this.status = "Not Started";
//       } else if (this.startDate && this.dueDate && now >= this.startDate && now <= this.dueDate) {
//           this.status = "In Progress";
//       } else if (this.dueDate && now > this.dueDate) {
//           this.status = "Overdue";
//       }
//   }

//   next();
// });

const taskModel = mongoose.model('Task', taskSchema);
export default taskModel;
