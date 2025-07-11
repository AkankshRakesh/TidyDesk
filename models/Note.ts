import mongoose from "mongoose"

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
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

export const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema)
