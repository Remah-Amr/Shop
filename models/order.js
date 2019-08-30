const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items: [{
        productId:{type: Schema.Types.ObjectId,ref:'Product',required:true},
        qty:{type:Number,required: true}
    }],
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
      },
      cost:{
          type: Number,
          required:true
      }
});

module.exports = mongoose.model('Orders',orderSchema);