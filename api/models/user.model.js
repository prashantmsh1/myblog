import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
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
        profilePicture: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2016/04/22/04/57/graduation-1345143_1280.png",
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
