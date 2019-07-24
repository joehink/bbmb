const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  body: { type: String, required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
}, { timestamps: true });

mongoose.model('Message', messageSchema)