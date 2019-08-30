const LocalStrategy  = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/user');

module.exports = function(passport){// we use email instead of username so we speacilze it below
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({email:email}).then(user => {

        if(!user){
            return done(null,false,{message:'No Found User!'}); // passport use in flash error
        }

        bcrypt.compare(password,user.password,(err,isMatch)=>{
            if(err) throw err;
            if(isMatch){
                return done(null,user);
            }else{
                return done(null,false,{message:'Password Incorrect!'});
            }
        })

    })
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id); // i think that id in my  db 'user model' saved to sessions
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

}


/*


        Where does user.id go after passport.serializeUser has been called?

The user id (you provide as the second argument of the done function) is saved in the session and is later used to retrieve the whole object via the deserializeUser function.

serializeUser determines which data of the user object should be stored in the session. The result of the serializeUser method is attached to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide the user id as the key) req.session.passport.user = {id: 'xyz'}

        We are calling passport.deserializeUser right after it where does it fit in the workflow?

The first argument of deserializeUser corresponds to the key of the user object that was given to the done function (see 1.). So your whole object is retrieved with help of that key. That key here is the user id (key can be any key of the user object i.e. name,email etc). In deserializeUser that key is matched with the in memory array / database or any data resource.

The fetched object is attached to the request object as req.user

Visual Flow

passport.serializeUser(function(user, done) {
    done(null, user.id); // this id same id in usere collection
});              │
                 │
                 │
                 └─────────────────┬──→ saved to session
                                   │    req.session.passport.user = {id: '..'} // like req.sesion.isLoggedIn , after i call it was initialze new one with that property 
                                   │                                              here passport call req.session.passport.user ,
                                   ↓
passport.deserializeUser(function(id, done) {
                   ┌───────────────┘
                   │
                   ↓
    User.findById(id, function(err, user) {
        done(err, user);
    });            └──────────────→ user object attaches to the request as req.user (automatically)
});

*/
