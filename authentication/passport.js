require('dotenv').config();
const passport  =require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/user");
var localStrategy  =require('passport-local')
const bcrypt = require("bcrypt");
passport.use(new GoogleStrategy({
    clientID:  process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL:  "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {

      console.log(profile);
      let user = await User.findOne({googleid:profile._json.sub});
      if(user){
        console.log("found");
        console.log("this is the found",user);
        return  cb(null,user);
      }
      else if(!user){
        console.log("not found so we create");
        await User.create({username:profile._json.name,googleid:profile._json.sub,googleAccessToken:accessToken,image: profile._json.picture,email:profile._json.email});
        return cb(null,user);
      }
      
    } catch (error) {
      return cb(error);
    }
    
  }
));

passport.serializeUser(function (User, done) {
  console.log(User);
  done(null, User._id);
});

passport.deserializeUser(async function (id, done) {
  try {
      let user = await User.findOne({ _id: id });
      done(null, user);
  } catch (err) {
      done(err);
  }
});

passport.use(new localStrategy(
  async function(username, password, done) {
    try {
      let user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } catch (error) {
      console.error("Local Strategy Error:", error);
      return done(error);
    }
  }
));


module.exports = passport;