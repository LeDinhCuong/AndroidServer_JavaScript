const express = require('express');
const productModel = require('../models/product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.get('/',(req,res) => {
  res.redirect('/product/list');
});

app.get('/view',(req,res) => {
  res.render('add-edit',{
    viewResult:"Vui lòng điền đầy đủ thông tin !",
    viewTitle:"THÊM SẢN PHẨM"
  });
});

// add data
app.post('/add', upload.single('image'), async (req, res) => {
  console.log(req.body);
  if (req.body.id == '') {
    addRecord(req,res);
  } else {
    updateRecord(req, res);
  }
});

function addRecord(req, res) {
  const productName = req.body.productName;
  const productType = req.body.productType;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const description = req.body.description;

  if (productName == "" || productType == ""|| quantity == ""|| price == ""|| description == "") {
    // Nếu bất kỳ giá trị nào bị thiếu, hiển thị thông báo lỗi cho người dùng.
    return res.render('add-edit', { viewResult: 'Vui lòng điền đầy đủ thông tin !! !!',viewTitle:"THÊM SẢN PHẨM" });
  }
  
  const image = "/uploads/" + req.file.filename; // Lưu đường dẫn đến ảnh vào database
  const product = new productModel({ productName, productType, price, quantity, description, image });
  
  const imagePath = path.join(__dirname, '..', image);
  const fileExt = path.extname(req.file.originalname);
  const newImagePath = imagePath + fileExt;
  fs.renameSync(imagePath, newImagePath);
  product.image = req.file.filename + fileExt;

  try {
    product.save();
    res.render('add-edit', {
      viewResult: 'Thêm sản phẩm thành công !!',viewTitle:"THÊM SẢN PHẨM"
    });
  } catch (error) {
    res.status(500).send(error);
  }
}



function updateRecord(req, res) {
  const productName = req.body.productName;
  const productType = req.body.productType;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const description = req.body.description;

  if (productName == "" || productType == ""|| quantity == ""|| price == ""|| description == "") {
    // Nếu bất kỳ giá trị nào bị thiếu, hiển thị thông báo lỗi cho người dùng.
    return res.render('add-edit', { viewResult: 'Vui lòng điền đầy đủ thông tin !! !!',viewTitle:"CẬP NHẬT SẢN PHẨM" });
  }

  const image = req.file ? req.file.filename : null;
  const update = {
    productName,
    productType,
    price,
    quantity,
    description,
  };

  if (image) {
    update.image = image;
  }
  productModel.findOneAndUpdate({ _id: req.body.id }, update, { new: true })
    .then(doc => {
      res.render('add-edit', {
        viewTitle: "CẬP NHẬT SẢN PHẨM",
        viewResult: "Cập nhật sản phẩm thành công !!"
      });
    })
    .catch(err => {
      console.log(err);
      res.render('add-edit', {
        viewResult: "Cập nhật thất bại"
      });
    });
}

app.get('/list', (req, res) => {
  productModel.find({}).then(products => {
    res.render('view-product', {
      products: products.map(product => product.toJSON())
    });
  })
});


//edit
app.get('/edit/:id',(req,res) => {
  productModel.findById(req.params.id).then(product => {
      res.render('add-edit',{
        viewResult:"Vui lòng điền đầy đủ thông tin !",
        viewTitle:"CẬP NHẬT SẢN PHẨM",
        product:product.toJSON()
      });
    
  }).catch(err => {
    console.log(err);
  });
});



//delete
app.get('/delete/:id', async(req,res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id,req.body);
    if(!product){
      res.status(404).send("No item found");
    }else{
      res.redirect('/product/list'); 
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
