import mongoose, { Schema } from "mongoose";

const parkingManSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const ParkingMan = mongoose.model("ParkingMan", parkingManSchema);