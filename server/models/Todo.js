const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  notes: [
    {
      type: String,
      trim: true,
    },
  ],
  mentionedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

todoSchema.index({ creator: 1, createdAt: -1 });
todoSchema.index({ creator: 1, status: 1 });
todoSchema.index({ creator: 1, priority: 1 });
todoSchema.index({ creator: 1, tags: 1 });
todoSchema.index({ creator: 1, title: "text", description: "text" });

todoSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Todo", todoSchema);
