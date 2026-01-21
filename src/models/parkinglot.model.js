import mongoose, { Schema } from "mongoose";


const parkingLotSchema = new Schema({
     parkingSlot: {
      type: [
        {
          slotNumber: Number,
          isBooked: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },

    availableSpots: {
      type: Number,
      default: function () {
        return this.totalSlots;
      },
    },

    location: {
        type: String,
        required: true,
    },
    totalSlots: {
        type: Number,
        required: true,
    },
  

    bookingDuration: {
        type: Number,
        required: true,
    },

    pricePerHour: {
        type: Number,
        required: true,
    },

}, { timestamps: true });

export const ParkingLot = mongoose.model("ParkingLot", parkingLotSchema);