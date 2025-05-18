import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  }
}, { timestamps: true });

// ป้องกันการบันทึกซ้ำ
favoriteSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);