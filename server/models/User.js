import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    profile_pic: { type: String, default: null },
    registered_at: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);
export default User;
