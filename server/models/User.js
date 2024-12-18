import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  online: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastMessage: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
