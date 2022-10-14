import UserModel from "../DB/models/User.js";

export default function checkProfile() {
  // get user data after Authentication
  return async (req, res, next) => {
    const id = req.user._id;
    const user = await UserModel.findById(id);
    if (!user.age || !user.phone || !user.address || !user.gender ) {
        res.json({message:"Please Complete Your Profile Data Before Add Product",user})
    } else {
      next();
    }
  };
}
