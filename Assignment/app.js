const express = require('express');
const exhbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');

const url = "mongodb+srv://cuongld3108:cuongld3108@cluster0.akigmrq.mongodb.net/dbUserManagerPolyDN?retryWrites=true&w=majority";


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('css'));
app.use(express.static('images'));
app.use(express.static('uploads'));
app.use(bodyParser.json());

app.engine('.hbs',exhbs.engine({extname:'.hbs', defaultLayout:"main"}));
app.set('view engine','.hbs');


mongoose.connect(url,{useUnifiedTopology:true, useNewUrlParser:true}); 

app.use('/product',productRoutes);
app.listen(3003,() => {console.log('sever is running');
})

