const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');
const Reply = mongoose.model('Reply');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
const Message = mongoose.model('Message');
const Conversation = mongoose.model('Conversation');


const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app, upload, gfs) => {

  // GET logged in user
  app.get('/api/users/', requireAuth, (req, res) => {
    // Return logged in user
    res.status(200).json({
      user: {
        username: req.user.username,
        _id: req.user._id,
        photo: req.user.photo || null
      }
    });
  })

  // GET a specific user
  app.get('/api/users/:userId', async (req, res) => {
    try {
      // If userId is not a mongoose id
      if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(404).json({ message: "User not found." });
      }

      const user = await User.findById(req.params.userId).select('-password');

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json(user)
    } catch(err) {
      res.status(500).json(err);
    }
  })

  // Create User
  app.post('/api/users/', async (req, res) => {
    try {
      if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: "Must provide username and password." });
      } else if (req.body.username.length > 25) {
        return res.status(400).json({ message: "Username must be 25 characters or less." });
      }
      // query to see if the username is already in use
      let foundUser = await User.findOne({ username: req.body.username });

      // if the username is not in use
      if (!foundUser) {
        // encrypt password
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));


        // create a new user
        const newUser = await User.create(req.body);

        // send back JSON Web Token
        res.status(200).json({
          token: jwt.encode({
            sub: newUser._id,
            iat: new Date().getTime()
          }, process.env.SECRET),
          user: {
            username: newUser.username,
            _id: newUser._id
          }
        });

      } else {
        // there is a user with that username
        res.status(409).json({ message: "Username is already in use" })
      }
    } catch(err) {
      res.status(500).json(err);
    }
    
  });

  // Update User
  app.put('/api/users/', upload.single('file'), requireAuth, async (req, res) => {
    try {
      // If a photo is submitted
      if (req.file) {
        // add the photo to req.body
        req.body.photo = req.file.filename;
      }

      // If a photo is submitted and the user currently has a photo
      if (req.file && req.user.photo) {
        // delete the current photo
        await gfs.remove({ filename: req.user.photo, root: "photos" });
      }
      
      // Update logged in user with new data
      let user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });

      res.status(200).json(user);
    } catch(err) {
      res.status(500).json(err)
    }
  });

  // delete user
  app.delete('/api/users/:userId', requireAuth, async (req, res) => {
    try {
      if (req.user._id.equals(req.params.userId)) {
        
        await Reply.deleteMany({ author: req.user._id });
        await Comment.deleteMany({ author: req.user._id });
        await Post.deleteMany({ author: req.user._id });
        await Message.deleteMany({ participants: req.user._id });
        await Conversation.deleteMany({ participants: req.user._id });
  
        // delete the user photo
        if (req.user.photo) {
          await gfs.remove({ filename: req.user.photo, root: "photos" });
        }
  
        // delete user
        await User.findByIdAndRemove(req.user._id);

        res.status(200).json({ deleted: true });
      }
      res.status(401).json({ message: 'Account does not belong to you.' });
    } catch (err) {
      res.status(500).json(err);
    }
  });
}