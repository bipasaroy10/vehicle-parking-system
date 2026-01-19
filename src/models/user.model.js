import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    userName: {
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
    carNumber: {
        type: String,
        required: true,
        unique: true,
    },
    carModel: {
        type: String,
        required: true,
    },
    userLicense: {
        type: String,
        required: true,
        unique: true,
    },
    


}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
