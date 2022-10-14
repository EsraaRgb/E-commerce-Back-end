import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref: "User",
  },
  comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}],
  likes: [{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
  isDeleted: {
    type: Boolean,
    default: false
  },
}
);
const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
