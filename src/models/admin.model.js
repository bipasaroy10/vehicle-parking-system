import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
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
}, { timestamps: true });

export const Admin = mongoose.model("Admin", adminSchema);