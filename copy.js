const express  = require('express');
const path = require('path');
const routes = require('./routes');
const bodyParser = require('body-parser');
const app = express();
const expressHbs = require('express-handlebars');
const errorControllers = require('./controllers/error'); 
const mongoConnect = require('./util/database').mongoConnect;

// template engines // extname special to mainlayout only and hbs first "extension name" for all layouts but not main
app.engine('hbs',expressHbs({layoutsDir: 'views/layouts/',defaultLayout: 'main-layout',extname: 'hbs'})); // since hbs not built in express we have to register hbs engine to express TO USING IT
app.set('view engine','hbs'); // we say to node use pug to dynamic templating , "consider the default templating engine"
app.set('views','views'); // and their templatings will be at views folder 'default ' thats second paramater , i can change name ,else i don't need it because its the default

// load Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// middleware bodyParser
app.use(bodyParser.urlencoded({extended : false}));


// Static Files
app.use(express.static(path.join(__dirname,'public')));

// Middleware Routes
app.use('/admin',adminRoutes); // only routes starts with /admin go to adminRoutes
app.use(shopRoutes);

// if the req don't go through any middleware (know that middleware has send method that mean ending and send response , then no middleware additional become , since code move from top to bottom and don't go with middleware the last one this i write will catch it)
app.use(errorControllers.getError); // pass as reference , not fire it

mongoConnect(() => {
    app.listen(5000,()=>{
        console.log(`server started on port successfully`);
        
    }); 
});



/*app.listen(5000,()=>{
    console.log(`server started on port successfully`);
    
});*/