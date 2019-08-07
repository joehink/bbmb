const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: String, required: true },
  commentId: { type: String, required: true },
}, { timestamps: true })

mongoose.model('Reply', replySchema);