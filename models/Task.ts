import mongoose from "mongoose"

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema)
