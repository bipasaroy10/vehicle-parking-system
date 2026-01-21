import { Admin } from "../models/admin.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ParkingLot } from "../models/parkinglot.model.js";


export const registerAdmin = asyncHandler(async (req, res, next) => {
  const {
    adminName,
    email,
    password,
    buildingName,
    totalSlots,
    location,
    pricePerHour,
  } = req.body;

  if (
    !adminName ||
    !email ||
    !password ||
    !buildingName ||
    !totalSlots ||
    !location ||
    !pricePerHour
  ) {
    return next(new ApiError(400, "All fields are required"));
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return next(new ApiError(400, "Email already in use"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 1️⃣ Create parking lot
 const slots = [];

for (let i = 1; i <= totalSlots; i++) {
  slots.push({
    slotNumber: i,
    isBooked: false,
  });
}

const parkingLot = await ParkingLot.create({
  totalSlots,
  availableSpots: totalSlots,
  location,
  pricePerHour,
  bookingDuration: 1,
  parkingSlot: slots,
});


  // 2️⃣ Create admin
  const admin = await Admin.create({
    adminName,
    email,
    password: hashedPassword,
    buildingName,
    parkingLot: parkingLot._id,
  });

  

  res.status(201).json(
    new ApiResponse(true, "Admin registered successfully", admin)
  );
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



export const getParkingStatus = asyncHandler(async (req, res, next) => {
  const adminId = req.admin._id;
    const user = req.user;

  const admin = await Admin.findById(adminId)
    .populate("parkingLot");

  if (!admin) {
    return next(new ApiError("Admin not found", 404));
  }

  const lot = admin.parkingLot;

  res.status(200).json(
    new ApiResponse(true, "Parking status fetched successfully", {
      totalSlots: lot.totalSlots,
      availableSpots: lot.availableSpots,
      parkingSlots: lot.parkingSlot,
      pricePerHour: lot.pricePerHour,
      location: lot.location,
      UsersBooked: lot.parkingSlot.filter(slot => slot.isBooked).length,
      
    })
  );
});
