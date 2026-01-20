import { Owner } from "../models/owner.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";

export const registerOwner = asyncHandler(async (req, res, next) => {
    try {
        const { ownerName, email, password } = req.body;    
        if (!ownerName || !email || !password) {
            return next(new ApiError(400, "Owner name, email and password are required"));
        }

        const existingOwner = await Owner.findOne({ email });
        if (existingOwner) {
            return next(new ApiError(400, "Email already in use"));
        }   
        const hashedPassword = await bcrypt.hash(password, 10);
        const newOwner = await Owner.create({
            ownerName,
            email,
            password: hashedPassword
        });
        res.status(201).json(
            new ApiResponse(true, "Owner registered successfully", newOwner)
        );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});


export const loginOwner = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ApiError(400, "Email and password are required"));
        }
        const owner = await Owner.findOne({ email });
        if (!owner) {
            return next(new ApiError(401, "Invalid email or password"));
        }
        const isPasswordValid = await bcrypt.compare(password, owner.password);
        if (!isPasswordValid) {
            return next(new ApiError(401, "Invalid email or password"));
        }
        const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.status(200).json(new ApiResponse(true, "Owner login successful", { token, owner: {
            id: owner._id,
            name: owner.ownerName,
            email: owner.email
        }}));
    }
    catch (error) {
        return next(new ApiError(500, error.message));
    }
});



// provide access all data of user and admin to authenticated owner

export const AccessAllData = asyncHandler(async (req, res, next) => {
    try {
        // Assuming req.owner is set by an authentication middleware
        const ownerId = req.owner._id;
        // Fetch all users and admins
        const users = await User.find({}).select('-password'); // Exclude passwords
        const admins = await Admin.find({}).select('-password'); // Exclude passwords
        res.status(200).json(new ApiResponse(true, "Access granted to all data", { users, admins }));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});