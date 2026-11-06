const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Customer email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"],
    },
    company: { type: String, trim: true, maxlength: 80 },
    status: {
      type: String,
      enum: {
        values: ["lead", "active", "inactive"],
        message: "Status must be lead, active or inactive",
      },
      default: "lead",
    },
    notes: { type: String, trim: true, maxlength: [500, "Notes cannot exceed 500 characters"] },
  },
  { timestamps: true }
);

// A user can't store the same customer email twice
customerSchema.index({ owner: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Customer", customerSchema);
