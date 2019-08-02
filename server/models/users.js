const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, lowercase: true, maxlength: 15 },
    password: { type: String, required: true },
    photo: String,
    bio: String
}, { timestamps: true });

mongoose.model('User', userSchema);