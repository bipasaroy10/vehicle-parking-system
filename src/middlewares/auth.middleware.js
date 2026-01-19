import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';
import ApiError from '../utils/apiError.js';

export const authenticateUser = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError('No token provided', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ApiError('User not found', 404));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new ApiError('Invalid token', 401));
    }
});



export const authenticateAdmin = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError('No token provided', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return next(new ApiError('Admin not found', 404));
        }
        req.admin = admin;
        next();
    }
    catch (error) {
        return next(new ApiError('Invalid token', 401));
    }
});


