const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
    body: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

const commentSchema = new Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    body: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    replies: [replySchema]
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;