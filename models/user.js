const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    resetToken:String,
    resetTokenExpiration:Date,
    cart: {
        items:[{
            productId: {type: Schema.Types.ObjectId,ref:'Product',required: true},
            qty: {type: Number,required: true}
        }]
    }
});

userSchema.methods.addToCart = function(prod){
    // this here refer to object who call this function
    
                const productIndex = this.cart.items.findIndex(p => prod._id.toString() === p.productId.toString());
                let newqty;
                let cartProudcts = [...this.cart.items];
                if(productIndex >= 0)
                {
                    newqty = this.cart.items[productIndex].qty + 1;
                    cartProudcts[productIndex].qty = newqty;
                   //  console.log(cartProudcts[productIndex].proudctId,prod._id); these are equal and same 
                    //updatedCart = {items: [...this.cart.items]};
                }   
                else{
        
                    const newProduct = {productId:prod._id,qty:1};
                    cartProudcts = [...this.cart.items,newProduct];
                    // another solution
                    // this.cart.items.push(newProduct);
                    // cartProudcts = this.cart.items;
                }     
                const updatedCart = {items:cartProudcts};
                this.cart = updatedCart;
                return this.save(); // return to then
            
}


userSchema.methods.deleteProductCart = function(prodId){
    const products = [...this.cart.items];
    const updatedProducts = products.filter(i =>  // or i => {return .......}
        i.productId.toString() !== prodId.toString()
    );
    this.cart.items = updatedProducts;
    return this.save(); // we return here to catch by then out , or error occured then not function
}

module.exports = mongoose.model('User',userSchema);


// const getDb = require('../util/database').getDb; // try to make it 
// const mongodb = require('mongodb');
// class User {
//     constructor(name,email,cart,id){
//         this.name = name; // this. mean define new property
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }

//     save(){
//         const db = getDb(); // to return value and store my database client in db constant  
//         return db.collection('users').insertOne(this);
//     }
//     static findById(userId){ // static because in controller i don't have porduct to call method , only id
//         const db = getDb();
//         return db.collection('users').findOne({_id: new mongodb.ObjectID(userId)});
//     }

//     addToCart(prod){
//         const productIndex = this.cart.items.findIndex(p => prod._id.toString() === p.productId.toString());
//         //console.log(prod._id);
       
//         let newqty;
//         let cartProudcts = [...this.cart.items];
//         if(productIndex >= 0)
//         {
//             newqty = this.cart.items[productIndex].qty + 1;
//             cartProudcts[productIndex].qty = newqty;
//            //  console.log(cartProudcts[productIndex].proudctId,prod._id); these are equal and same 
//             //updatedCart = {items: [...this.cart.items]};
//         }   
//         else{

//             const newProduct = {productId:new mongodb.ObjectID(prod._id),qty:1};
//             cartProudcts = [...this.cart.items,newProduct];
//         }     
//         const updatedCart = {items:cartProudcts};
//         const db = getDb();
//         return db.collection('users').updateOne({_id: new mongodb.ObjectID(this._id)},{$set: {cart:updatedCart}});
//     }
//     // hero to show how relations become in nosql database
//     getCart() { //then style cart page , then video pug
//         const db = getDb();
//         const productIds = this.cart.items.map(i => { // The map() method creates a new array with the results of calling a function for every array element.
//           return i.productId;
//         }); // first get ids from User model by object req.user 
        
//         return db
//           .collection('products')
//           .find({ _id: { $in: productIds } })
//           .toArray() // if i call find i convert it to array to show them
//           .then(products => {
//             return products.map(p => {  // i must return here to go next then at another file , else if i don't return i don't have var contain new array
//               return { // i will return object for each element in products array which included in cart also
//                 ...p, // push element of object , here is objectid
//                 qty: this.cart.items.find(i => { 
//                   return i.productId.toString() === p._id.toString();
//                 }).qty // find return finally one object only
//                 // The find() method returns the value of the first element in an array that pass a test (provided as a function 'here is  i =>   return i.productId.toString() === p._id.toString(); } ).
//                 // The find() method executes the function once for each element present in the array;
//               };
//             });
//           });
//       }

//       // from remah :) 
//        deleteById(id){
//         const db = getDb();
//         const products = [...this.cart.items];
//         const updatedProductCart = products.filter(i => i.productId.toString() !== id.toString());
//         console.log(updatedProductCart);
//         this.cart.items = [...updatedProductCart];
//         const updatedCart = {items: this.cart.items}; // because cart is object
//         return db.collection('users').updateOne({_id: new mongodb.ObjectID(this._id)},{$set: {cart:updatedCart}});
//         // or {cart : {items: updatedProductCart}}
//       }

//       addToOrder(){
//         const db = getDb();
//         return this.getCart().then(products =>{ // i must return because i write then out
//           const order = {
//             items: products, // include all data
//             user : {
//               _id: new mongodb.ObjectID(this._id), // same i store without covering , but fine when search
//               name: this.name
//             }
//           }
//           return db.collection('orders').insertOne(order);
//           // here 3 notes : 
          
//         })
//         .then(result => {
//           this.cart = {items: []}; // 1
//           return db.collection('users').updateOne({_id: new mongodb.ObjectID(this._id)},{$set: {cart:{items: []}}});
//         // 1 : if i comment this.cart also run correctly because i don't update with this code in db ;
//             // if i comment first return will be false because i retrieve then in controllers to addToOrder fun
//             // if i comment 2nd return will be true 
//             // in get cart i return more than one because finally i return products mutual , which meaning db.collection..... pass one thing that is the products mutual , mean this line as package return one value , and inside it i pass each part to above part until go to return to getCart()
//           })
//       }

//       getOrders(){
//         const db = getDb(); 
//         return db.collection('orders').find({"user._id": new mongodb.ObjectID(this._id)}).toArray();

//       }
      

// }

// module.exports = User;