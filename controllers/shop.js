const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const ITEMS_PER_PAGE = 1;
const stripe = require('stripe')('sk_test_SVRDEXzhjXekCVehdmqa5pu600tCrdZF2t');

exports.getIndex = (req, res, next) => {
  const page = req.query.page || 1;
   // if i load first i consider it 1
  let TotalItems;
  Product.find()  // i dont't put toArray because in mongoose retrieve data not as a cursor but array 'in find'
  .countDocuments()
  .then(numProducts => {
    TotalItems = numProducts;
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
  })
    .then(products => {
      res.render('shop/index',{
        prods : products,
        pageTitle : 'Index',
        activeShop: true,
        currentPage : page,
        hasNext: ITEMS_PER_PAGE * page < TotalItems,
        hasPrevious: page > 1,
        lastPage: Math.ceil(TotalItems / ITEMS_PER_PAGE),
        nextPage: +page + 1, // to convert to number because it string
        previousPage : page - 1
      }); 
   
    });
}
 

exports.getProducts = (req, res, next) => {
  const page = req.query.page || 1;
   // if i load first i consider it 1
  let TotalItems;
  Product.find()  // i dont't put toArray because in mongoose retrieve data not as a cursor but array 'in find'
  .countDocuments()
  .then(numProducts => {
    TotalItems = numProducts;
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
  })
    .then(products => {
      res.render('shop/product-list',{
        prods : products,
        pageTitle : 'Products',
        activeProducts: true,
        currentPage : page,
        hasNext: ITEMS_PER_PAGE * page < TotalItems,
        hasPrevious: page > 1,
        lastPage: Math.ceil(TotalItems / ITEMS_PER_PAGE),
        nextPage: +page + 1, // to convert to number because it string
        previousPage : page - 1
      }); 
   
    });
}

exports.getProduct = (req,res,next) => {
  const id = req.params.productId;
  Product.findById(id)
  // .select('title price -_id ') // here i want to choose title and price to show and exlude _id
  // .populate('userId','-_id') // also i can select at populate like this and exlude also
  .then(product => { // second param is value i need
    // console.log(product._id);
    // console.log(product.id); same result
    res.render('shop/product-detail',{
      product: product,
      pageTitle: product.title
    })
  })
  
}


exports.getCart = (req, res, next) => {
  User.findById(req.user._id).populate("cart.items.productId").then(user => {
    // console.log(user.cart.items);
    res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: user.cart.items,
          activeCart: true
        });
  })
};
/*execpopulate: 
Explicitly executes population and returns a promise. Useful for ES2015
integration.
Returns:<Promise> promise that resolves to the document when population is done 
error: req.user.populate().then is not function , so nothing send to then , execpopulate send promise

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()                       
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
}; */

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId; // from form
  Product.findById(prodId).then(product => {
    //console.log(product);
    return req.user.addToCart(product); // equally to load model User then find certain user with that id then add product to his cart
  }).then(result => {
    //console.log(result);
    res.redirect('/cart');
  })
  // if i put res.redirect here will show before add last product , because node is non-blocking
};
// alternative method by me , instead of put methods in model
/*
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId; // from form
    User.findById(req.user._id).then(user => {
      
      const productIndex = user.cart.items.findIndex(p => prodId.toString() === p.productId.toString());
      console.log(productIndex);
      let newqty;
      let cartProudcts = [...user.cart.items];
      if(productIndex >= 0)
      {
          newqty = user.cart.items[productIndex].qty + 1;
          cartProudcts[productIndex].qty = newqty;
         //  console.log(cartProudcts[productIndex].proudctId,prod._id); these are equal and same 
          //updatedCart = {items: [...this.cart.items]};
      }   
      else{
  
          const newProduct = {productId:prod._id,qty:1};
          cartProudcts = [...user.cart.items,newProduct];
      }     
      const updatedCart = {items:cartProudcts};
      user.cart = updatedCart;
      return user.save(); // return to then
   // equally to load model User then find certain user with that id then add product to his cart
    }).then(result => {
      //console.log(result);
      res.redirect('/cart');
    })
    // if i put res.redirect here will show before add last product , because node is non-blocking
  };*/
 
// another way
// exports.postCartDeleteProduct = (req,res,next) => {
//   const prodId = req.body.productId;
//   User.findById(req.user._id).then(user => {
//     const products = [...user.cart.items];
//     const updatedProductCart = products.filter(i => i.productId.toString() !== prodId.toString());
//     user.cart.items = updatedProductCart;   
//     console.log(user.cart.items);
//     user.save();
//     res.redirect('/cart');
//   })
// }


exports.postCartDeleteProduct = (req,res,next) => {
  const prodId = req.body.productId;
  req.user.deleteProductCart(prodId).then(result => { // req.user instead of User.findById(req.user._id).then(user => {})
    console.log('Deleted Product');
    res.redirect('/cart');
  });
}


exports.getOrders = (req,res,next) => {
              // if nested be in single quote
  Order.find({userId:req.user._id}).populate('items.productId').populate('userId').then(orders => {
    res.render('shop/orders',{
      orders: orders,
      pageTitle: 'Orders',
      activeOrders: true
    })
  })
}
// in original cases i don't use _doc but if it store only first element 'id' not all i write ...name._doc 'object has field called _doc'
//  const user = orders.map(i => {return {...i.userId._doc}});
//      console.log(user);
//     const items = orders.map(i => {return i.items});
//      console.log(...items);
//     const products = items[0].map(i => {return {...i.productId._doc}});
//     console.log(products); // show all dataProducts also nested data from another collection

exports.postOrder = (req,res,next) => {
  // we put process of stripe here because this route which i put action in form
  const token = req.body.stripeToken; // from form created by stripe
  let totalSum = 0; // to be availbale to all then's blocks

  User.findById(req.user._id).populate('cart.items.productId').then(user => {
    const items = user.cart.items;
    const userId = req.user._id;
    var cost = user.cart.items.map(i =>{return i.qty*i.productId.price});
    cost = cost.reduce(function(acc,value){ // to sum values
      return acc + value;
    },0);
    // console.log(cost);
    const order = new Order({items: items,userId: userId,cost:cost});
    order.save().then(result => {
      const charge = stripe.charges.create({ // which go to your account
        amount: cost * 100, // because there deal with cent
        currency: 'usd',
        description: 'Demo Order',
        source: token,
        metadata: { order_id: result._id.toString() } // because log say this must be string if you remove toString()
      });
      user.cart.items = [];
      user.save();
      res.redirect('/orders');
    })
    
  })
}

exports.getCheckout = (req,res,next) => {
  User.findById(req.user._id).populate("cart.items.productId").then(user => {
    let total = 0; 
    const products = user.cart.items; // to get total salary
    products.forEach(p => {
      total += p.qty * p.productId.price;
    })
    res.render('shop/checkout', {
          pageTitle: 'Checkout',
          products: products,
          totalCard: total * 100,
          total: total
        });
  })
}


exports.getInvoice = (req,res,next) => { // you can check before do anything
  const orderId = req.params.orderId;
  Order.findById(orderId).populate('items.productId').then(order => {
    if(order.userId.toString() === req.user._id.toString())
      {
        const invoiceName = 'invoice-' + orderId + '.pdf';
        const invoicePath = path.join('invoices',invoiceName);  
        const pdfDoc = new PDFDocument(); // you can add images also , see Docs
        pdfDoc.pipe(fs.createWriteStream(invoicePath));// create file on server on fly
        res.setHeader('Content-Type','application/pdf'); // to deal as pdf
        res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"'); // inline mean open in browser
        pdfDoc.pipe(res); // return our pdf to user which res is writableStream , pdfDoc is readable one
        pdfDoc.fontSize(26).text('Invoice',{ // text write single line
          underline: true
        }); 
        order.items.forEach(prod => {
          pdfDoc.fontSize(14).text(`${prod.productId.title} - qty: ${prod.qty}`)
          console.log(prod.productId);
        });
        pdfDoc.text('------------');
        pdfDoc.text(`Total Price: ${order.cost}`);
        pdfDoc.end();
      }
      else{
        return next(new Error('Not Authorized!'))
      }
  })
}
// fs.readFile(invoicePath,(err,data)=>{ // that's good for small file , read entire content to memory then send it
        //   if(err){
        //     return next(err);
        //   }
        //   res.setHeader('Content-Type','application/pdf'); // to deal as pdf
        //   res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"'); // inline mean open in browser
        //   // res.setHeader('Content-Disposition','attachment;filename="'+invoiceName+'"'); // to download it 
        //   res.send(data);
        // })


/*const file = fs.createReadStream(invoicePath);
        res.setHeader('Content-Type','application/pdf'); // to deal as pdf
        res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"'); // inline mean open in browser
        // res.setHeader('Content-Disposition','attachment;filename="'+invoiceName+'"'); // to download it 
        file.pipe(res);// pipe node.js writable stream , res is writable stream actually , i read in createReadStream then write by this line
        // for huge files this approach is optimal, i don't load data in memory may take long time or overflow done if data is bigger, instead i send streams of data in fly step by step to client whithout load it */