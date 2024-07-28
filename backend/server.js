const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const router = express.Router();
const RequestForProposal = require('./models/RequestForProposal');
const rfpRoute = require('./routes/rfp');  


const app = express();
const port = 5000;

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passport.use(new GoogleStrategy({
    clientID: 'GOOGLE_CLIENT_ID', // replace with your Google Client ID
    clientSecret: 'GOOGLE_CLIENT_SECRET', // replace with your Google Client Secret
    callbackURL: "/auth/google/callback" 
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// MongoDB Connection
mongoose.connect('mongodb://localhost/mern-stack', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
});

// Route for Google OAuth 
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// Routes for RFQs: 
app.use('/api', rfpRoute);





app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});
