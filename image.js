// const multer = require('multer');

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

//   app.use(multer({storage: fileStorage,fileFilter: fileFilter}).single('image')); // name of field in hbs
//   app.use('/images',express.static(path.join(__dirname,'images')));
  // you have to add enctype="multipart/form-data" in form you upload like this
  // multer different from bodyParser which second deal with text only , first deal with mixed files and text
  // multer is middleware fire for every req to look if form is multipart/form-data , then take file 'image here' and store it in fileStorage you need
  // file is binary data
  // i save the path to image not image because not effecient way to store data 'image.path'
  // i add / 'sometimes' to src in view pages to remove any additional path , like /admin which i add in app.js in app.use to every route in admin folder so image not download because path will be /admin/images/...png
  // and express take last part of url then replace with image , e.g. if i in /admin/products => remove products then replace with /images/..png
  // add / create new absolute path prevent above error
  // when i set folder static i suppose it root folder , to this reason when i call files 'css' in hbs i don't call public 
  // so when i call image it be => /images/name.png and '/images/name.png' not image in real so i use in first in app.use '/images' to say : hey if any req with that url pls access this folder
  // so i want it be only name.png
