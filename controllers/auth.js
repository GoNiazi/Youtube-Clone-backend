import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send("User has been created!");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  console.log("heelo");
  try {
    console.log("in sign in");
    console.log(req.body);
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found!"));
    console.log("correct user");
    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));
    console.log("correct password");
    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 9000000,
      })
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log("im in google");
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      console.log("down", user._doc);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newuser = new User({ ...req.body, fromGoogle: true });
      const saveduser = await newuser.save();
      const token = jwt.sign({ id: saveduser._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 9000000,
        })
        .status(200)
        .json(saveduser._doc);
    }
  } catch (error) {
    next(error);
  }
};
