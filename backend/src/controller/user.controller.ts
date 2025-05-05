import { Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "30d";

export interface AuthenticatedRequest extends Request {
  user?: any;
}


const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: "Please provide all required fields" });
      return
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: "User already exists" });
      return
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "standard",
      status: "active"
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
      } as jwt.SignOptions);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profilePicture: user.profilePicture,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Please provide email and password" });
      return 
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.isDisabled) {
          res.status(401).json({ message: "Account disabled" });
        return
      }

      user.lastActive = new Date();
      await user.save();

      const token = jwt.sign(
        { id: user._id }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRE } as jwt.SignOptions
      );

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profilePicture: user.profilePicture,
        lastActive: user.lastActive,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getUsersList = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select("name");
    res.json(users);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getUserById = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Invalid user ID" });
      return 
    }

    const user = await User.findById(req.params.id).select("-password");

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.profilePicture = req.body.profilePicture || user.profilePicture;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        profilePicture: updatedUser.profilePicture,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const updateUser = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Invalid user ID" });
      return 
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.status = req.body.status || user.status;
      user.isDisabled = req.body.isDisabled !== undefined ? req.body.isDisabled : user.isDisabled;
      user.profilePicture = req.body.profilePicture || user.profilePicture;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        isDisabled: updatedUser.isDisabled,
        profilePicture: updatedUser.profilePicture,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Invalid user ID" });
      return
    }

    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUser,
  deleteUser,
  getUsersList
};