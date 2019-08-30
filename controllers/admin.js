const Product = require('../models/product');
const {validationResult} = require('express-validator');
const fs = require('fs'); // to delete images from file

exports.getAddProduct = (req, res, next) => { 
    res.render('admin/edit-product', {
     pageTitle: 'Add Product',  
     path: '/admin/add-product',
     formsCSS: true, 
     productCSS: true,
     activeAddProduct: true 
    }); 
};


exports.postAddProduct = (req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {      
    return res.status(422).render('admin/edit-product',{ // status which refer to validate is wrong
            pageTitle: 'Add Product',
            activeAddProduct: true,
            errorMessage: errors.array()[0].msg,
            keepUserInput: true,
            product: { // i do that to be same syntax inside edit-product-hbs when call title and price , i avoid to use send req.body to hbs because syntax will differnce
              title:req.body.title,
              price:req.body.price,
              description:req.body.description
            }
    })
}
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const userId = req.user._id;
    // console.log(image);
    if(!image){ // like pdf or other or don't choose file
      return res.status(422).render('admin/edit-product',{ // status which refer to validate is wrong
        pageTitle: 'Add Product',
        activeAddProduct: true,
        errorMessage: 'attached file must be an image!',
        keepUserInput: true,
        product: { // i do that to be same syntax inside edit-product-hbs when call title and price , i avoid to use send req.body to hbs because syntax will differnce
          title:req.body.title,
          price:req.body.price,
          description:req.body.description,
        }
})
    }
    const imageUrl = image.path; // property if you log image , and i store path in db not image because not effecient way
    const product = new Product({title: title,price: price,imageUrl: imageUrl,description: description,userId: userId});      

    product
    .save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      res.status(422).render('admin/edit-product',{ // status which refer to validate is wrong
        pageTitle: 'Add Product',
        activeAddProduct: true,
        keepUserInput: true,
        errorMessage:'you have to fill all options!',
        product: { // i do that to be same syntax inside edit-product-hbs when call title and price , i avoid to use send req.body to hbs because syntax will differnce
          title:req.body.title,
          price:req.body.price,
          description:req.body.description,
          _id:req.body.productId
        }
})
     
       console.log(err);
      // const error = new Error(err); // to fire default error middleware in app.js
      // return next(error);
    });
};

// this method if id click on button Edit at page will include query in url then render page edit-product
exports.getEditProduct = (req, res, next) => { 
  
    const editMode = req.query.edit; // only value attached with edit , see docs if confusion 
    // console.log(editMode); // http://localhost:9999/admin/edit-product/0.09390696256550957?edit=true&color=red => true
    
    if (!editMode) {
      return res.redirect('/'); // if return we finish our code
    }
    const prodId = req.params.productId; // until ?
    Product.findById(prodId).then(product => {
      if (!product) {
        return res.redirect('/');
      }
      if(product.userId.toString() !== req.user._id.toString()){ // if another user try to access this product which not belong to him
        res.redirect('/admin/products');
      }
      else {
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product
        });
      }
    });
  };

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {      
       return res.status(422).render('admin/edit-product',{ // status which refer to validate is wrong
              pageTitle: 'Edit Product',
              activeAddProduct: true,
              errorMessage: errors.array()[0].msg,
              keepUserInput: true,
              editing:true,
              info: req.body,
              product: {
                title:req.body.title,
                price:req.body.price,
                description:req.body.description,
                _id:req.body.productId
              }
              // to use same syntax inside hbs send object product here
      })
  }
    Product.findById(prodId).then(product => { // {_id:req.body.productId } also true
     product.title  = req.body.title;
     product.price = req.body.price;
     product.description = req.body.description;
     const image = req.file; // here i don't render old image and keep field empty , then i check if user doesn't choose any new one 'or pdf which not allow'that mean image = undefined i keep old one , else i updated it
     if(image){
       fs.unlink(product.imageUrl,(err) => { // to delete old image from server
        if(err){
          console.log(err);
        } 
       })
       product.imageUrl = image.path;
     }
     product.save()
     .then(result => {
       console.log('Updated Product');
       res.redirect('/admin/products');
     })
     .catch(err => {
      res.status(422).render('admin/edit-product',{ // status which refer to validate is wrong
        pageTitle: 'Edit Product',
        activeAddProduct: true,
        keepUserInput: true,
        errorMessage:'you have to fill all options!',
        editing:true,
        product: {
          title:req.body.title,
          price:req.body.price,
          description:req.body.description,
          _id:req.body.productId
        }
        // to use same syntax inside hbs send object product here
})
       console.log(err);
     })
     
   
    })

  // to understand another way with additional then
  /*Product.findById(prodId).then(product => { // {_id:req.body.productId } also true
    product.title  = req.body.title;
    product.price = req.body.price;
    product.imageUrl = req.body.imageUrl;
    product.description = req.body.description;
    return product.save();
  })
  .then(result => {
    console.log('Updated Product');
    res.redirect('/admin/products');
  .catch(err => {
      console.log(err);
    })
    
  
   })*/
};

exports.postDeleteProduct = (req,res,next) => { // if i remove from products collection also remove from cart because i fetch first from cart then search in proudcts which include same id
  const prodId = req.body.productId;
  Product.findById(prodId).then(product => { // to delete image from server
    fs.unlink(product.imageUrl,(err) => { // i pass path product.imageUrl , because it stores as path in db
     if(err){
       console.log(err);
     }
    })
  })
  Product.deleteOne({_id: prodId}).then(()=> { // can also : findByIdAndRemove(prodId)
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
    
  })

}

exports.getProducts = (req,res,next) => {
    Product.find().then((products) => { // find all products , but if not product fit to user will be hidden the buttons , from function in helpers file
        res.render('admin/products',{
          prods : products,
          pageTitle : 'adminProducts',
          activeAdminProducts: true
        }); 
    });
}