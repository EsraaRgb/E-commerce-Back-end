import ProductModel from "../../../DB/models/Product.js";
import UserModel from "../../../DB/models/User.js";

export const addProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const product = await new ProductModel({
      title,
      description,
      price,
      createdBy: req.user._id,
    }).save();
    await UserModel.findByIdAndUpdate(req.user._id, {
      $push: { products: product._id },
    });
    // await UserModel.findByIdAndUpdate(req.user._id,{$addToSet: {products: product._id}},) // second way
    res.status(201).json({ message: "done", product });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;
    const product = await ProductModel.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { title, description, price },
      { new: true }
    );
    if (product) {
      res.status(202).json({ message: "Done", product });
    } else {
      res.status(400).json({
        message: "In-valid Id or You are Not the Product Owner",
        product,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductModel.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
    });
    if (result) {
      res.status(202).json({ message: "Done", result });
    } else {
      res.status(400).json({
        message: "In-valid Id or You are Not the Product Owner",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductModel.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user._id,
      },
      {
        isDeleted: true,
      },
      { new: true }
    );
    if (result) {
      res.status(202).json({ message: "Done", result });
    } else {
      res.status(400).json({
        message: "In-valid Id or You are Not the Product Owner",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({}).populate([
      {
        path: "comments",
        match: { isDeleted: false },
      },
    ]);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch error", error });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id).populate({
      path: "comments",
      match: { isDeleted: false },
    });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "In-valid Product Id" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const likeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductModel.findOneAndUpdate(
      {
        _id: id,
        createdBy: { $ne: req.user._id },
        likes: { $nin: req.user._id },
      },
      {
        $push: { likes: req.user._id },
      }
    );
    if (result) {
      res.status(201).json(result);
    } else {
      res.status(400).json({
        message: "Wrong Id or you are not allowed to like the product",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const unLikeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductModel.findOneAndUpdate(
      {
        _id: id,
        likes: { $in: req.user._id },
      },
      {
        $pull: { likes: req.user._id },
      }
    );
    if (result) {
      res.status(202).json(result);
    } else {
      res.status(400).json({
        message: "Wrong Id or you are not allowed to unlike the product",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const searchProductByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const products = await ProductModel.find({ title: { $regex: `${title}` } });
    if (products) {
      res.status(200).json({ products });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
