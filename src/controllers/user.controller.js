import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
//import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
    // get all  details from frontend 
    // validation -not empty
    // check if user already exists: username , email
    // check for images , check for avatar
    // upload them to cloudinary , avatar
    // create user object - create entery in db 
    // remove password and refresh token field from response
    // check for creation 
    // return res

    const { fullName, email, userName, password } = req.body
    // console.log("email :", email);


    if ([fullName, email, userName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required ")
    }
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImagePath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {

        throw new ApiError(500, "Somrthing went wrong registering the user")

    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, " User registred successfully")
    )

});


export { registerUser }