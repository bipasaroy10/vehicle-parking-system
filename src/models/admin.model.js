import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    adminName: {
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

    buildingName: {
      type: String,
      required: true,
    },

    parkingLot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingLot",
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
