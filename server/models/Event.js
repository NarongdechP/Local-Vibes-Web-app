import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  event_name: { type: String, required: true, trim: true },
  description: { type: String },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  location: { type: String },
  category: { type: String },
  Organizer: { type: String }, // ✅ เพิ่มชื่อผู้จัด
  price: { type: Number },      // ✅ เพิ่มราคาตั๋ว
  amount: { type: Number },     // ✅ เพิ่มจำนวนตั๋ว
  event_image_url: { type: String, default: "" }, // ✅ URL รูปภาพ
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now }
});

const Event = mongoose.model("Event", EventSchema);
export default Event;


