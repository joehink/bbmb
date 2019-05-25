const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    photo: { type: mongoose.Schema.Types.ObjectId, ref: 'photos.files', required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;