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
    phoneNumber: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
    },  

    carNumber: {
        type: String,
        unique: true,
    },
    carModel: {
        type: String,
    },
    userLicense: {
        type: String,
        unique: true,
    },

    


}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
