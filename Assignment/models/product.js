const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  productName: {
    type: String
  },
  productType:{
    type:String
  },
  price :{
    type: Number
  },
  quantity:{
    type:Number
  },
  description:{
    type:String
  },
  image: {
    type: String 
  }
});

const Product = mongoose.model('Product',ProductSchema);
module.exports = Product;
