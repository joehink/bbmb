const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');

const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app, upload, gfs) => {

  // GET logged in user
  app.get('/api/users/', requireAuth, (req, res) => {
      res.status(200).json(req.user);
  })

  // GET a specific user
  app.get('/api/users/:userId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).select('-password');
      res.status(200).json(user)
    } catch(err) {
      res.status(500).json(err);
    }
  })

  // Create User
  app.post('/api/users/', async (req, res) => {
    try {
      // query to see if the username is already in use
      let foundUser = await User.findOne({ username: req.body.username })

      // if the username is not in use
      if (!foundUser) {
        // encrypt password
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

        // create a new user
        const newUser = await User.create(req.body);

        // send back JSON Web Token
        res.status(200).json({
          token: jwt.encode({
            sub: newUser.id,
            iat: new Date().getTime()
          }, process.env.SECRET)
        });

      } else {
        // there is a user with that username
        res.status(409).json({ message: "Username is already in use" })
      }
    } catch(err) {
      res.status(400).json(err);
    }
    
  });

  // Update User
  app.put('/api/users/', upload.single('file'), requireAuth, async (req, res) => {
    try {
      if (req.file) {
        req.body.photo = req.file.filename;
      }

      if (req.file && req.user.photo) {
        await gfs.remove({ filename: req.user.photo, root: "photos" });
      }
      
      let user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });

      res.status(200).json(user);
    } catch(err) {
      res.status(500).json(err)
    }
  })
}