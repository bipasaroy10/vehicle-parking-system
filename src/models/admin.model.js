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
    buildingName: {
        type: String,
        required: true,
    },
    capacity: {
        type: mongoose.Schema.Types.Number,
        ref: 'ParkingLot',
    },
    availableSpots: {
        type: mongoose.Schema.Types.Number,
        ref: 'ParkingLot',
    },
    parkingSlot: {
        type: mongoose.Schema.Types.String,
        ref: 'ParkingLot',
    },
    location: {
        type: mongoose.Schema.Types.String,
        ref: 'ParkingLot',
    },
    bookingTime: {
        type: mongoose.Schema.Types.Date,
        ref: 'ParkinLot'
    }


}, { timestamps: true });

export const Admin = mongoose.model("Admin", adminSchema);