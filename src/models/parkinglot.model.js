import mongoose, { Schema } from "mongoose";


const parkingLotSchema = new Schema({
    parkingSlot: {
        type: String,
        required: true,
        enum:[ ]
    },
    location: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
  
    availableSpots: {
        type: Number,
        required: true,
    },
    bookingTime: {
        type: Date,
        required: true,
    },

}, { timestamps: true });

export const ParkingLot = mongoose.model("ParkingLot", parkingLotSchema);