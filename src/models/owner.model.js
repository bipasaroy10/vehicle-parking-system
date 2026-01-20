import mongoose, { Schema } from "mongoose";

const ownerSchema = new Schema({
    ownerName: {
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
}, { timestamps: true });
export const Owner = mongoose.model("Owner", ownerSchema);