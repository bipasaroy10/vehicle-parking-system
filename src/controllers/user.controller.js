import { User } from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import bcrypt from 'bcryptjs';
import ApiResponse from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const registerUser = asyncHandler(async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return next(new ApiError(400, "Username, email and password are required"));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ApiError(400, "Email already in use"));
        }

        if (!req.files?.profileImage || !req.files?.userLicense) {
            return next(new ApiError(400, "Profile image and user license are required"));
        }

        const profileImageLocalPath = req.files.profileImage[0].path;
        const userLicenseLocalPath = req.files.userLicense[0].path;

        const profileImage = await uploadOnCloudinary(profileImageLocalPath);
        const userLicense = await uploadOnCloudinary(userLicenseLocalPath);

        if (!profileImage || !userLicense) {
            return next(new ApiError(500, "Failed to upload images"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            userName,
            email,
            password: hashedPassword,
            profileImage,
            userLicense
        });console.log("Profile image path:", profileImageLocalPath);
console.log("License image path:", userLicenseLocalPath);


        

        res.status(201).json(
            new ApiResponse(true, "User registered successfully", newUser)
            
        );

    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});


export const loginUser = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ApiError(400, "Email and password are required"));
        }
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ApiError(401, "Invalid email or password"));
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new ApiError(401, "Invalid email or password"));
        }
const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
});
        res.status(200).json(new ApiResponse(true, "Login successful", { token, user: {
          id: user._id,
          name: user.name,
          email: user.email
        } }));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});



export const getUser = asyncHandler(async (req, res, next) => {
   try {
     const userId = req.user._id;
     const user = await User.findById(userId).select('-password');
     if (!user) {
         return next(new ApiError('User not found', 404));
     }
     res.status(200).json(new ApiResponse(true, 'User fetched successfully', user));
   } catch (error) {
        return next(new ApiError({message:error.message}));
   }
});


export const updateAccountDetails = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        if (!updatedUser) {
            return next(new ApiError('User not found', 404));
        }
        res.status(200).json(new ApiResponse(true, 'User updated successfully', updatedUser));


    } catch (error) {
        return next(new ApiError({message:error.message}));
    }
});

export const updatePassword = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return next(new ApiError('User not found', 404));
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return next(new ApiError('Current password is incorrect', 401));
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json(new ApiResponse(true, 'Password updated successfully'));
    } catch (error) {
        return next(new ApiError({message:error.message}));
    }
        
    
});