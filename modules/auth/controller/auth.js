import UserModel from "../../../DB/models/User.js";
import sendEmail from "../../../services/sendEmail.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Cryptr from "cryptr";

export const signUp = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      age,
      address,
      phone,
      gender,
    } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(403).json({ message: "Email exist" });
    } else {
      const hashedPassword = await bcrypt.hash(
        password,
        +process.env.SALT_ROUNDS
      );

      //  phone number encryption using cryptr
      if (phone) {
        const cryptr = new Cryptr(process.env.SECRET);
        const phone = cryptr.encrypt(phone);
      }
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        age,
        address,
        phone,
        gender,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.SECRET, {
        expiresIn: 60 * 60,
      });
      const link = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmation/${token}`;
      const message = `  <div> To Confirm Your Account, Please <a  href= ${link}>Click Here</a> </div>`;
      sendEmail(email, message);
      res.status(201).json({ message: "Done, Please Confirm Your Account", savedUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch error", error });
  }
};

export const confirmAccount = async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.SECRET);
    if (decoded && decoded.id) {
      const result = await UserModel.updateOne(
        { _id: decoded.id, confirmEmail: false },
        { confirmEmail: true }
      );
      if (result.modifiedCount) {
        res.status(202).json({ message: "Done" });
      } else {
        res.status(400).json({ message: "Already confirmed OR In-valid ID" });
      }
    } else {
      res.status(403).json({ message: "In-valid Token" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({
      email,
      confirmEmail: true,
      isBlocked: false,
      isDeleted: false,
    });
    if (user) {
      const checkPassResult = await bcrypt.compare(password, user.password);
      if (checkPassResult) {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.TOKENSIGNATURE,
          {
            expiresIn: 60 * 60,
          }
        );
        const refreshToken = jwt.sign(
          { id: user._id },
          process.env.TOKENSIGNATURE,
          {
            expiresIn: 60 * 60 * 24,
          }
        );
        await UserModel.findByIdAndUpdate(
          { _id: user._id },
          { isOnline: true }
        );
        res.status(202).json({ message: "Done", token, refreshToken });
      } else {
        res.status(403).json({ message: "In-valid Password" });
      }
    } else {
      res.status(404).json({ message: "In-valid Email" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const signOut = async (req, res) => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { _id: req.user._id, isOnline: true },
      { isOnline: false, lastSeen: Date.now() },
      { new: true }
    );
    if (result) {
      res.status(202).json({ message: "Done", result });
    } else {
      res.status(400).json({ message: "User is Not onLine" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const code = nanoid();
    const user = await UserModel.findOneAndUpdate(
      { email },
      { code },
      { new: true }
    ).select("email firstName");
    if (user) {
      const token = jwt.sign(
        { code, email, id: user._id },
        process.env.TOKENSIGNATURE,
        { expiresIn: 60 * 10 }
      );
      const link = `${req.protocol}://${req.headers.host}/api/v1/auth/resetpassword/${token}`;
      const message = `<div>
          To Reset Your Password, Please <a  href= ${link}>Click Here</a> 
          your reset code is ${code}
          </div>`;
      sendEmail(email, message);
      res.status(202).json({ message: "Done" });
    } else {
      res.status(404).json({ message: "In-valid User Email" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const resetPassword = async (req, res) => {
  try {
    console.log("reset pass");
    const { token } = req.params;
    const { email, password } = req.body;
    const decoded = jwt.verify(token, process.env.TOKENSIGNATURE);
    if (decoded && decoded.code) {
      const user = await UserModel.findByIdAndUpdate(decoded.id, { code: "" });
      if (decoded.code === user.code) {
        const hashedPassword = await bcrypt.hash(
          password,
          +process.env.SALT_ROUNDS
        );
        await UserModel.findByIdAndUpdate(decoded.id, {
          password: hashedPassword,
        });
        res.status(202).json({ message: "Done" });
      } else {
        res.status(403).json({ message: "In-valid Link" });
      }
    } else {
      res.status(403).json({ message: "In-valid Token" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.TOKENSIGNATURE);
    if (decoded && decoded.id) {
      const user = await UserModel.findById(decoded.id).select("email");
      if (user) {
        const newToken = jwt.sign(
          { id: user._id, email: user.email },
          process.env.TOKENSIGNATURE,
          { expiresIn: 60 * 60 }
        );
        res.status(201).json({ token: newToken });
      } else {
        res.status(404).json({ message: "In-valid user" });
      }
    } else {
      res.status(403).json({ message: "In-valid Token" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
