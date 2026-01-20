import { Admin } from "../models/admin.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const registerAdmin = asyncHandler(async (req, res, next) => {
    try {
        const { adminName, email, password, buildingName, capacity, location, parkingSlots } = req.body;
        if (!adminName || !email || !password || !buildingName || !capacity || !location || !parkingSlots) {
            return next(new ApiError(400, "All fields are required"));
        }   
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return next(new ApiError(400, "Email already in use"));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({
            adminName,
            email,
            password: hashedPassword,
            buildingName,
            capacity,
            location,
            availableSpots: capacity,
            parkingSlots: JSON.parse(parkingSlots)
        }); 
        res.status(201).json(
            new ApiResponse(true, "Admin registered successfully", newAdmin)
        );
    }   catch (error) {
        return next(new ApiError(500, error.message));
    }   
});





export const loginAdmin = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ApiError(400, "Email and password are required"));
        }
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return next(new ApiError(401, "Invalid email or password"));
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return next(new ApiError(401, "Invalid email or password"));
        }   
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.status(200).json(new ApiResponse(true, "Admin login successful", { token, admin: {
            id: admin._id,
            name: admin.adminName,
            email: admin.email
        }}));
    }
    catch (error) {
        return next(new ApiError(500, error.message));
    }
});



export const getAdmin = asyncHandler(async (req, res, next) => {
    try {   
        const adminId = req.admin._id;
        const admin = await Admin.findById(adminId).select('-password');

        if (!admin) {
            return next(new ApiError('Admin not found', 404));
        }
        res.status(200).json(new ApiResponse(true, 'Admin fetched successfully', admin));
    } catch (error) {
        return next(new ApiError({message:error.message}));
    }
});


//booking status after user books a slot

export const getBookingStatus = asyncHandler(async (req, res, next) => {
    try {
        const adminId = req.admin._id;
        const admin = await Admin.findById(adminId).populate('bookings');
        if (!admin) {   
            return next(new ApiError('Admin not found', 404));
        }
        res.status(200).json(new ApiResponse(true, 'Booking status fetched successfully', admin.bookings));
    } catch (error) {
        return next(new ApiError({message:error.message}));
    }
});
