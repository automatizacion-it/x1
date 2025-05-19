import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  originalName: String,
  filePath: String,
  mimeType: String,
  letter: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("File", fileSchema);
