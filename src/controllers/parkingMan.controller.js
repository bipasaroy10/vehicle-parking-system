import { ParkingMan } from "../models/parkingMan.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";

export const registerParkingMan = asyncHandler(async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;    
        if (!name || !email || !phone || !password) {
            return next(new ApiError(400, "Name, email, phone and password are required"));
        }
        const existingParkingMan = await ParkingMan.findOne({ email });
        if (existingParkingMan) {
            return next(new ApiError(400, "Email already in use"));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newParkingMan = await ParkingMan.create({
            name,
            email,
            phone,
            password: hashedPassword
        });
        res.status(201).json(
            new ApiResponse(true, "Parking man registered successfully", newParkingMan)
        );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export const loginParkingMan = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;   
        if (!email || !password) {
            return next(new ApiError(400, "Email and password are required"));
        }
        const parkingMan = await ParkingMan.findOne({ email });
        if (!parkingMan) {
            return next(new ApiError(401, "Invalid email or password"));
        }
        const isPasswordValid = await bcrypt.compare(password, parkingMan.password);
        if (!isPasswordValid) {
            return next(new ApiError(401, "Invalid email or password"));
        }
        const token = jwt.sign({ id: parkingMan._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.status(200).json(new ApiResponse(true, "Parking man login successful", { token, parkingMan: {
            id: parkingMan._id,
            name: parkingMan.name,      
            email: parkingMan.email
        }}));
    }   
    catch (error) {
        return next(new ApiError(500, error.message));
    }
});


// provide access all data of user and admin to authenticated owner

export const accessAllData = asyncHandler(async (req, res, next) => {
    try {
        const parkingManId = req.parkingMan._id;
        const users = await User.find({}.select('-password'));
        const admins = await Admin.find({}.select('-password'));
        res.status(200).json(new ApiResponse(true, "Access granted to all data", { users, admins }));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});
        
        