const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, required: true, maxlength: 150 },
    body: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    category: { type: String, required: true, lowercase: true },
    lastCommentAt: { type: Date, required: true, default: new Date() },
    commentsCount: { type: Number, required: false, default: 0 }
}, { timestamps: true });

postSchema.index({title: 'text', body: 'text'});

mongoose.model('Post', postSchema);