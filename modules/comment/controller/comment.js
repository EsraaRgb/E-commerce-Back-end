import CommentModel from "../../../DB/models/Comment.js";
import ProductModel from "../../../DB/models/Product.js";
import UserModel from "../../../DB/models/User.js";

export const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const newComment = new CommentModel({
      commentBody: comment,
      createdBy: req.user._id,
      productId: req.params.id,
    });
    const product = await ProductModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        $push: { comments: newComment._id },
      }
    );
    if (product) {
      const savedComment = await newComment.save();
      res.status(201).json({ comment: savedComment });
    } else {
      res.status(404).json({ message: "In-valid product Id" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const updatedComment = await CommentModel.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { commentBody: comment },
      { new: true }
    );
    if (updatedComment) {
      res.status(202).json({ message: "Done", updatedComment });
    } else {
      res.status(404).json({ message: "Wrong Comment Id" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const softDeleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userProducts = await UserModel.findById(userId).select("products");
    const result = await CommentModel.findOneAndUpdate(
      {
        _id: id,
        $or: [
          { createdBy: req.user._id },
          { productId: { $in: userProducts.products } },
        ],
      },
      { isDeleted: true, deletedBy: req.user._id },
      { new: true }
    );
    if (result) {
      res.status(202).json({ message: "Done" ,result});
    } else {
        res.status(404).json({ message: "Wrong comment Id or you are Not authorized To Delete This Comment" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
