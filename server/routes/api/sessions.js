const jwt = require('jwt-simple');
const passport = require('passport');

const requireSignIn = passport.authenticate('local', { session: false });

module.exports = app => {
  // Log In
  app.post('/api/sessions', requireSignIn, async (req, res)=> {
    try {
      // send back JSON Web Token
      res.status(200).json({
        token: jwt.encode({
          sub: req.user.id,
          iat: new Date().getTime()
        }, process.env.SECRET)
      });
    } catch(err) {
      res.status(500).json({ message: 'Invalid credentials.'});
    }
  });
}