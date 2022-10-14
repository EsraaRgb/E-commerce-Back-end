import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

    commentBody:{
        type: String,
        required: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "Product",
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
    deletedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

})

const CommentModel = mongoose.model('Comment',commentSchema)
export default CommentModel
