const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', unique: true }],
    category: { type: String, required: true, lowercase: true }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;