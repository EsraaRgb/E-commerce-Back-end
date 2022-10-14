import UserModel from "../../../DB/models/User.js";
import sendEmail from '../../../services/sendEmail.js'
import bcrypt from 'bcryptjs'
import Cryptr from "cryptr";
import jwt from 'jsonwebtoken'


export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    user ? res.status(202).json(user) : res.status(404).json({ message: "In-valid User Id" });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const { email, firstName, lastName, age, address, gender } = req.body;
    let { phone } = req.body;
    let confirmEmail
    if (phone) {
      const cryptr = new Cryptr(process.env.SECRET);
      phone = cryptr.encrypt(phone);
    }
    if (email && email !== req.user.email){
      const token = jwt.sign({ id: req.user._id }, process.env.SECRET , { expiresIn: 60 * 60 });
      const link = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmation/${token}`;
      const message = `  <div> To Confirm Your Changed Email, Please <a  href= ${link}>Click Here</a> </div>`;
      sendEmail(email, message);
      confirmEmail=false
    }
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        email,
        firstName,
        lastName,
        age,
        address,
        phone,
        gender,
        confirmEmail,
      },
      { new: true }
    );
    if (user) {
      res.status(202).json({ message: "Done", user });
    } else {
      res.status(404).json({ message: "wrong user id" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch error", error });
  }
};
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user._id).select("password");
    if (user) {
      const match = await bcrypt.compare(oldPassword, user.password);
      if (match) {
        const hashedPassword = await bcrypt.hash(
          newPassword,
          +process.env.SALTROUNDS
        );
        const result = await UserModel.updateOne(
          { _id: req.user._id },
          { password: hashedPassword }
        );
        if (result.modifiedCount) {
          res.status(202).json({ message: "Done" });
        } else {
          res.status(400).json({ message: "wrong request" });
        }
      } else {
        res.status(403).json({ message: "wrong old Password" });
      }
    } else {
      res.status(404).json({ message: "wrong user id" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const softDeleteProfile = async (req, res) => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      { isDeleted: true },
      { new: true }
    );
    if (result) {
      res.status(202).json({ message: "Done", result });
    } else {
      res.status(404).json({ message: "wrong user id" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}).populate({
      path: "products",
      populate: { path: "comments" },
      match: { isDeleted: false },
    });
    // Decrypt user’s phone
    const cryptr = new Cryptr(process.env.SECRET);
    users.forEach((user) => {
      user.phone ? (user.phone = cryptr.decrypt(user.phone)) : "";
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const blockUser = async (req, res) => {
  try {
    const isAdmin = await UserModel.findOne({
      _id: req.user._id,
      role: "admin",
    });
    if (isAdmin) {
      const { id } = req.params;
      const blockedUser = await UserModel.findByIdAndUpdate(
        id,
        { isBlocked: true },
        { new: true }
      );
      res.status(202).json({ message: "Done", blockedUser });
    } else {
      res.status(403).json({ message: "Not Admin" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
