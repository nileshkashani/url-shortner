import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    shortCode: {
        type:  String,
        required: true,
        unique: true,
    },

    originalUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const URL = mongoose.model("url", urlSchema)

export default URL;
