import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const  signup = async(req, res) => {
  const {fullName,email,password}=req.body;
  try {
     if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  }
  catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).send("Internal Server Error");
  }
  
}
export const  login = async(req, res) => {
const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const  logout = (req, res) => {
   try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export const updateUserDetails = async (req, res) => {
  try {
    const { fullName, email, profilePic } = req.body;
    const userId = req.user._id; 

    const updateFields = {};

   
    if (fullName) {
      updateFields.fullName = fullName;
    }

    

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Email already in use." });
      }
      updateFields.email = email;
    }


   if (typeof profilePic !== "undefined") {
  if (profilePic === "") {
    updateFields.profilePic = ""; // clear profile picture
  } else {
    const uploadRes = await cloudinary.uploader.upload(profilePic, {
      folder: "user_profiles",
    });
    updateFields.profilePic = uploadRes.secure_url;
  }
}

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });
console.log("Updated User:", updatedUser);

    res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ message: "Something went wrong." });
  }
};



export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};