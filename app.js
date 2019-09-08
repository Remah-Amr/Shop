const express  = require('express');
const path = require('path');
const routes = require('./routes');
const bodyParser = require('body-parser');
const app = express();
const socket = require('socket.io');
const expressHbs = require('express-handlebars');
const errorControllers = require('./controllers/error'); 
const mongoose = require('mongoose');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
const MONGODB_URI = 'mongodb+srv://remah:remah654312@cluster0-ytypa.mongodb.net/shop?retryWrites=true&w=majority';
const csrf = require('csurf');
const csrfProtection = csrf();
const flash = require('connect-flash');
const {editAndDelete} = require('./helpers/hbs');
const passport = require('passport');
// const multer = require('multer');
const keys = require('./config/keys');
const compression = require('compression');

// load handlebar helpers
require('./helpers/helperHbs');


// template engines // extname special to mainlayout only and hbs first "extension name" for all layouts but not main
app.engine('hbs',expressHbs({layoutsDir: 'views/layouts/',defaultLayout: 'main-layout',extname: 'hbs',helpers:{editAndDelete:editAndDelete}})); // since hbs not built in express we have to register hbs engine to express TO USING IT
app.set('view engine','hbs'); // we say to node use pug to dynamic templating , "consider the default templating engine"
app.set('views','views'); // and their templatings will be at views folder 'default ' thats second paramater , i can change name ,else i don't need it because its the default

// load Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// compression middleware : reduce size of responce to make smaller and faster ('reduce css and js middlewares'), most hosting use compression by default so you don't need to it
// use before handling any req
// most hosting providers added ssl, compression, logging'operation on your app like post get so on' , but heroku not so you have to add it
// app.use(compression());

// load config
require('./config/passport')(passport); // if put in auth file will succeeded

// const fileStorage = multer.diskStorage({ // to pass to multer middleware to determine distination and filename 
//     destination: (req, file, cb) => {
//       cb(null, 'images');
//     },
//     filename: (req, file, cb) => {
//       cb(null, new Date().toISOString() + '-' + file.originalname); // if you log imageurl you see fields like originalname and filename , mimetype , encoding from file object
//     }
//   });

//   const fileFilter = (req, file, cb) => { // pass to multer to determine any type i save
//     if (
//       file.mimetype === 'image/png' ||
//       file.mimetype === 'image/jpg' ||
//       file.mimetype === 'image/jpeg'
//     ) {
//       cb(null, true); // save if type of image one of these
//     } else {
//       cb(null, false); // not save if else
//     }
//   };
  
  
// middleware bodyParser
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
// app.use(bodyParser.urlencoded({extended : false})); // urlencoded is basicly text data
// app.use(multer({storage: fileStorage,fileFilter: fileFilter}).single('image')); // name of field in hbs ,// single because one file'stored in req.file', array if multiple files 'stored in req.files'

// session processing                                         
const store = new mongodbStore({
  uri:MONGODB_URI,
  collection: 'sessions'
})

// session middlware
app.use(session({secret:'my secret',resave:false,saveUninitialized:false,store: store}));


// passport middleward : must after session
app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); // after session because i use it when call req.flash() 'req.name add this to session (i think)'

// Load User Model : don't want it now
const User = require('./models/user');
  
// Static Files
app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images'))); // i use this when i want to access image to show it in views

// global vars which use in hbs only
app.use((req,res,next) => { // instead of call to every render
    //   throw new Error('Dummy!'); showing in errorTest.js
  res.locals.isAuthenticated = req.session.passport;
  // res.locals.csrfToken = req.csrfToken(); // suppose error: csrf is not defined , move these lines above middlewares as you can
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage = req.flash('success');
  res.locals.user = req.user || null;
  next(); // req die here if remove it
})

// specilaize route because stripe use it's own csrfToken , so i should to disable it from my app
const shopControllers = require('./controllers/shop');
const {ensureAuthenticated} = require('./helpers/auth'); // destructuring
app.post('/create-order',ensureAuthenticated,shopControllers.postOrder);    


// csrfToken middleware : must after session because it use session
app.use(csrfProtection);

// global vars which use in hbs only
app.use((req,res,next) => { // instead of call to every render
res.locals.csrfToken = req.csrfToken(); 
next(); // req die here if remove it
})
// Middleware Routes
app.use('/admin',adminRoutes); // only routes starts with /admin go to adminRoutes
app.use(shopRoutes);
app.use(authRoutes);


// if the req don't go through any middleware (know that middleware has send method that mean ending and send response , then no middleware additional become , since code move from top to bottom and don't go with middleware the last one this i write will catch it)
app.use(errorControllers.getError); // pass as reference , not fire it

app.use((error,req,res,next)=>{ // in add product Controller & global vars
  console.log(error);
  
    res.status(500).render('Fix',{
        pageTitle: 'Fixing Error!'
    });
})

mongoose.connect(keys.MONGO_URI,{ useNewUrlParser: true }) // i can connect with mlab
  .then(result => {
    console.log('connected');
  }).catch(err => {console.log(err);})

const port = process.env.PORT || 4000;

const server = app.listen(port,()=>{
    console.log(`server started on port successfully`);
});

const io = require('./socket').init(server); // pass server to method io 'like prev code but i put function in another file then fire it'
    io.on('connection', socket => {
      console.log('Client connected');
      socket.on('chat',data => {
        console.log(data); // work true
        socket.broadcast.emit('chat',data);
      })
    });