import dotenv from "dotenv";
import express from "express";
import connectDB from "./DB/connection.js";
import * as Router from "./modules/index.router.js";
import Cryptr from "cryptr";
import bcrypt from "bcryptjs";
import UserModel from "./DB/models/User.js";
dotenv.config();
const app = express();
app.use(express.json());
connectDB();

const createAdmin = async () => {
  const newAdmin = {
    email: "esraargbali@gmail.com",
    password: "Admin123",
    firstName: "admin",
    lastName: "admin",
    phone: "01227004955",
    role: "admin",
  };
  const result = await UserModel.findOne({
    email: newAdmin.email,
    role: "admin",
  });
  if (!result) {
    const cryptr = new Cryptr(process.env.SECRET);
    newAdmin.password = await bcrypt.hash(
      newAdmin.password,
      +process.env.SALT_ROUNDS
    );
    newAdmin.phone = cryptr.encrypt(newAdmin.phone);
    const admin = await new UserModel(newAdmin).save();
    console.log(admin);
  }
};

app.use(`${process.env.BASE_URL}/auth`, Router.authRouter);
app.use(`${process.env.BASE_URL}/user`, Router.userRouter);
app.use(`${process.env.BASE_URL}/product`, Router.productRouter);
app.use(`${process.env.BASE_URL}/comment`, Router.commentRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port ${process.env.PORT}`);
  createAdmin();
});
