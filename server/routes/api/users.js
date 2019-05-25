const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const passport = require('passport');
const User = require('../../models/users.js');

const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app, upload, gfs) => {
  // Create User
  app.post('/api/users/', async (req, res) => {
    try {
      // query to see if the username is already in use
      let foundUser = await User
      .findOne({ username: req.body.username })

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
        req.body.photo = req.file.id;
      }

      if (req.file && req.user.photo) {
        await gfs.remove({ _id: req.user.photo, root: "photos" });
      }
      
      const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true })
      res.status(200).json(user);
    } catch(err) {
      res.status(500).json(err)
    }
  })
}