const User = require('../models/user');
const crypto = require('crypto'); // not related to csrt token
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {validationResult} = require('express-validator');
 
// some email not send to it ;
// const transproter = nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_key: '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'
//     }
// }))

const transproter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'remah3335@gmail.com', // must go to الامان then وصول التطبيقات الاقل أمانا https://myaccount.google.com/lesssecureapps
           pass: 'remah654312'
       }
   });
exports.getLogin = (req,res,next) => {
    res.render('auth/login',{
        pageTitle: 'Login',
        isAuthenticated: false, // if you don't send it set to false auto
        activeLogin: true
    })
}
// exports.postLogin = (req,res,next) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     User.findOne({email: email}).then(user => {
//         if(!user){
//             req.flash('error','Invalid Email Or Password');//  if you call req.flash is gone from session , that happen in appjs
//             // console.log(req.flash());
//             return res.redirect('/login');
//         }
//         bcrypt.compare(password,user.password).then(isMatch => {
//             if(!isMatch)
//             {
//               req.flash('error','Invalid Email Or Password'); 
//               res.redirect('/login');
//             }else{
//                 req.session.isLoggedIn = true;
//                 res.redirect('/');
//             }
//         }).catch(err => {console.log(err)});
//     })    
// }

exports.postLogin = (req,res,next) => {
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect: '/login',
        failureFlash: true // to use error as req.flash('error')
      })(req, res, next);
}

exports.postLogout = (req,res,next) => {
    // req.session.destroy(err => {
    //     // console.log(err);
    //     res.redirect('/');  
        
    // })
    req.logout();
    res.redirect('/');
}


exports.getSignup = (req,res,next) => {
    // here a good idea, if you must to check message null or not like in ejs , you store message in var then check the length , if 0 set to null
    res.render('auth/signup',{
        pageTitle: 'Signup',
        activeSignup: true
    })
}

exports.postSignup = (req,res,next) => { 
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    const emailErrorClass = errors.array().find(e => e.param == 'email') ? 'invalid' : '';
    const passwordErrorClass = errors.array().find(e => e.param == 'password') ? 'invalid' : '';
    const confirmErrorClass = errors.array().find(e => e.param == 'confirmPassword') ? 'invalid' : '';
    if (!errors.isEmpty()) {      
        return res.status(422).render('auth/signup',{ // status which refer to validate is wrong
                pageTitle: 'Signup',
                activeSignup: true,
                errorMessage: errors.array()[0].msg,
                keepUserInput: true,
                info: req.body,
                emailErrorClass:emailErrorClass,
                passwordErrorClass: passwordErrorClass,
                confirmErrorClass: confirmErrorClass
        })
    }
    
        bcrypt.hash(password,12).then(hashedpassword =>{
            const user = new User({email: email,password:hashedpassword,cart:{items:[]}});
            return user.save();
        }).then(result =>{
            req.flash('success','You Have Signed Up Successfully!')
            res.redirect('/login');
            transproter.sendMail({
                to: email,
                from: 'remah3335@gmail.com',
                subject:'Signup Succeeded',
                html:`<h1>You ${email} Successfulley Signed Up</h1>`
            })
            .then(result => {
                console.log('send email');
                
            })
        });

}

exports.getReset = (req,res,next) => {
    res.render('auth/reset',{
        pageTitle: 'Reset',
        
    })
}

// exports.postReset = (req, res, next) => {
//     crypto.randomBytes(32, (err, buffer) => {
//       if (err) {
//         console.log(err);
//         return res.redirect('/reset');
//       }
//       const token = buffer.toString('hex');
//       User.findOne({ email: req.body.email })
//         .then(user => {
//           if (!user) {
//             req.flash('error', 'No account with that email found.');
//             return res.redirect('/reset');
//           }
//           user.resetToken = token;
//           user.resetTokenExpiration = Date.now() + 3600000;
//           return user.save();
//         })
//         .then(result => {
//           res.redirect('/');
//           transproter.sendMail({
//                 to: req.body.email,
//                 from: 'remah3335@gmail.com',
//                 subject:'Signup Succeeded',
//                 html: `
//                 <p>You requested a password reset</p>
//                 <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
//                 `
//             })
//             .then(result => {
//                 console.log('send email');
                
//             })
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     });
//   };

exports.postReset = (req,res,next) => {
    crypto.randomBytes(32,(err,buffer) => { // to produce buffer as unique secure random value to access link to reset password
        if(err)
        {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex'); // hex type of encryption
        User.findOne({email: req.body.email}).then(user => {
            if(!user)
            {
                req.flash('error','This Email Not Found.');
                res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000; // valid one hour only
            user.save();
            res.redirect('/');
            transproter.sendMail({
                to: req.body.email, // whitch enterd in form
                from: 'remah3335@gmail.com',
                subject:'Reset Password',
                html: ` 
                <p>You requested a password reset</p>
                <p>Click this <a href="https://arcane-spire-72778.herokuapp.com/reset/${token}">link</a> to set a new password.</p>
              ` // use packtic to write more than line
            })
            .then(result => {
                console.log('send email');
                
            })

        })
    })
}


exports.getNewPassword = (req,res,next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt:Date.now()}}).then(user => { // must date in db greater than from date now
        if(!user)
        {
            req.flash('error','Sorry , you must access link before one hour!');
            res.redirect('/login');
        }
        else{
            res.render('auth/new-password',{
                userId: user._id.toString(),
                pageTitle: 'NewPassword'
            })
        }
    }).catch(err => console.log(err))
}


exports.postNewPassword = (req,res,next) => {
    const id = req.body.userId; // from hidden input
    const password = req.body.password;
    bcrypt.hash(password,12).then(hashedpassword =>{
        User.findById(id).then(user => {
            user.password = hashedpassword; // old value will be override
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            user.save();
            res.redirect('/login');
        })
    }).catch(err => {
        console.log(err);
        
    })
}





// another way to send error with arrays

// exports.postSignup = (req,res,next) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     const confirmPassword = req.body.confirmPassword;
//     let errors = [];
//     User.findOne({email: email}).then(userDoc => {
//         if(userDoc){
//             errors.push({text:'Repeated Email'}); 
//             return res.render('auth/signup',{ // if you not put return will get error can't set headers after sent to client
//                 pageTitle: 'Signup',
//                 activeSignup: true,
//                 errors: errors
//             })
//         }
//         bcrypt.hash(password,12).then(hashedpassword =>{
//             const user = new User({email: email,password:hashedpassword,cart:{items:[]}});
//             return user.save();
//         }).then(result =>{
//             res.redirect('/login');
//         });
//     })
//    .catch(err => console.log(err));
// }