import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    event_name: { type: String, required: true, trim: true },
    description: { type: String },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    location: { type: String },
    category: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    created_at: { type: Date, default: Date.now }
});

const Event = mongoose.model("Event", EventSchema);
export default Event;

