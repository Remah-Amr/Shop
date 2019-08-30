const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth');
const {check} = require('express-validator'); // you can also extract body or any part of request object to make certain search
const User = require('../models/user');


router.get('/login',authControllers.getLogin);

router.post('/login',check('email').normalizeEmail(),check('password').trim(),authControllers.postLogin); // to take email and convert it to lower case

router.post('/logout',authControllers.postLogout);

router.post('/signup',
[
check('email').isEmail().withMessage('You Have to Enter Validate Email!'),
check('email').custom(value => { // call async validation because you have to wait until search in database
    return User.findOne({email: value}).then(user => {
      if (user) {
        return Promise.reject('E-mail already in use');
      }
    });
  }).normalizeEmail(), // to lowerCase every char after enter it by user , you can put it anywere , call sanitizers 
check('password','You have to enter only numbers and text and at least 5 characters').isLength({ min: 5 }).isAlphanumeric().trim(), // to remove white space at beginig or end
check('confirmPassword').trim().custom((value,{req})=> { // extract request object 'destructring syntax'
    if(value !== req.body.password){
        throw new Error('Passwords Must To Match!');
    }
    return true; // to move on another field
})
]
,authControllers.postSignup);

router.get('/signup',authControllers.getSignup);

router.get('/reset',authControllers.getReset);

router.post('/reset',authControllers.postReset);

router.get('/reset/:token',authControllers.getNewPassword);

router.post('/new-password',authControllers.postNewPassword);

module.exports = router;
