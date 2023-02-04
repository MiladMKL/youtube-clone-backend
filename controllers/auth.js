import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { createError } from '../error.js';
import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// Wer übergibt mir "next"?
export const signup = async (req, res, next) => {
  // console.log(req.body);
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    // console.log({ ...req.body, password: hash });
    // Speichere hash als password in MongoDB
    await newUser.save();
    res.status(200).send('User has been created!');
  } catch (err) {
    // next(err);
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    // Find this name in MongoDB
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return next(createError(404, 'User not found!'));
    }

    // Await is sehr wichtig hier!
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) {
      return next(createError(400, 'Wrong credentials!'));
    }

    // Creating a token based on id from MongoDB
    const token = jwt.sign({ id: user._id }, process.env.JWT);

    // Remove/seperate the hashed password from other details
    const { password, ...others } = user._doc;

    // Sending cookie named 'access_token' with value: token to the user
    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};
