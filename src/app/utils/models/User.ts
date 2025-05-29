import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
console.log("Mongoose models:", mongoose.models);
// Check if the model already exists to avoid recompilation
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;