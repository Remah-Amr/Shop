const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// to make structure of data , and know how data looks like , mongoose offer me Schema to arrange this , i can do without Schema

const productSchema = new Schema({
  title: {
    type: String,
    required: true // if i make it empty will give error
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required:true
  }
});
                                // name of your model , mongoose make this name lower case and plural and make this name of cllection
module.exports = mongoose.model('Product',productSchema,'Products'); // 3rd par to explicit name of collection
                                          // send structure which my data go on 













// const getDb = require('../util/database').getDb; // declare function

// const mongodb = require('mongodb'); // to use mongodb.ObjectID to wrap id with fit shape
// class Product {
//   constructor(title, price, description, imageUrl,id,userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectID(id) : null;
//     this.userId = userId;
//     //if(id) {this._id = new mongodb.ObjectID(id)}
//     // if i write this._id = new mongodb.ObjectId(id) ; will generate id either null or not , then when call save it always if(this._id) be true
//   }

//   save() {
//     const db = getDb(); // i have to return the value first
//     let dbOp;
//     if (this._id) {
//       // Update the product
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: this._id }, { $set: this }); // first i pass id to req then cover with ObjectId and compare in DB , if equally i replace all element , then no worry about replace _id because it same
//     } else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp
//       .then(result => {
//         //console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }


//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products').find().toArray() // i think it must in an array to fetch it 
//     .then(products => {
//       //console.log(products);
//       return products;
//     })
//     .catch(err =>
//        console.log(err)
//        );
//   }

//   static findById(id) { // static because i have only id , not product to call method 
//     const db = getDb();             // here was find and next()
//     return db.collection('products').findOne({_id: new mongodb.ObjectID(id)})// _id is the value & ObjectId , id is id only we wrapped it with the object
//     .then(product => {
//      // console.log(product);
//       return product;
//     })
//      .catch(err => {
//        console.log(err);
       
//      }) 
//      // return db.collection('products').findOne({_id: new mongodb.ObjectID(id)}); only true also
//   }

//   static deleteById(prodId){
//     const db = getDb(); 
//     return db.collection('products').deleteOne({_id: new mongodb.ObjectID(prodId)})
//       .then((result)=> {
//           console.log('Deleted Product');
//       })
//         .catch(err => {
//           console.log(err);
          
//         })
//   }

// }

// module.exports = Product;