const express = require('express');
const md5 = require('blueimp-md5');

const UserModel = require('../models/UserModel');
const CategoryModel = require('../models/CategoryModel');
const ProductModel = require('../models/ProductModel');

const router = express.Router();

//image upload route
require('./image-upload')(router);

//login
router.post('/login', (req, res) => {
  const {username, password} = req.body;

  UserModel.findOne({username, password: md5(password)})
    .then(user => {
      if (user) { // success
        // cookie(userid: user._id)
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24});

        user._doc.role = {menus: []};
        // return info(user)
        res.json({status: 0, data: user})

      } else {// failure
        res.json({status: 1, msg: 'Wrong username or password'})
      }
    })
    .catch(error => {
      console.error('login error', error);
      res.json({status: 1, msg: 'login err, please try again'})
    })

});


// add category
router.post('/manage/category/add', (req, res) => {
  const {categoryName} = req.body;
  CategoryModel.findOne({name: categoryName})
    .then(category => {
      if (category) {
        res.send({status: 1, msg: 'The category exists'})
      } else {
        CategoryModel.create({name: categoryName})
          .then(category => {
            res.send({status: 0, data: category})
          })
          .catch(error => {
            console.error('Add Category Error', error);
            res.send({status: 1, msg: 'Add Category Error, please try again'})
          })
      }
    })
});

// get all categories
router.get('/manage/category/list', (req, res) => {
  CategoryModel.find({})
    .then(categorys => {
      res.send({status: 0, data: categorys})
    })
    .catch(error => {
      console.error('get category error', error);
      res.send({status: 1, msg: 'get category error, please try again'})
    })
});


// update category
router.post('/manage/category/update', (req, res) => {
  const {categoryId, categoryName} = req.body;
  CategoryModel.findOneAndUpdate({_id: categoryId}, {name: categoryName})
    .then(oldCategory => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('update category error', error);
      res.send({status: 1, msg: 'update category, please try again'})
    })
});

// get category by id
router.get('/manage/category/info', (req, res) => {
  const categoryId = req.query.categoryId;
  CategoryModel.findOne({_id: categoryId})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('get category by id error', error);
      res.send({status: 1, msg: 'get category by id error, please try again'})
    })
});

// add product
router.post('/manage/product/add', (req, res) => {
  const product = req.body;
  console.log('product', product);
  ProductModel.findOne({name: product.name})
    .then(p => {
      if (p) {
        res.send({
          status: 1,
          msg: 'The product exists'
        })
      } else {
        ProductModel.create(product)
          .then(product => {
            res.send({
              status: 0,
              data: product
            })
          })
          .catch(error => {
            console.error('add product error', error)
            res.send({
              status: 1,
              msg: 'add product error, please try again'
            })
          })
      }
    })
});

// get products pagination
router.get('/manage/product/list', (req, res) => {
  const {pageNum, pageSize} = req.query;
  ProductModel.find({})
    .then(products => {
      res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('get products error', error);
      res.send({status: 1, msg: 'get products error, please try again'})
    })
});

// search product and get products
router.get('/manage/product/search', (req, res) => {
  const {pageNum, pageSize, searchName, productName, productDesc} = req.query;
  let contition = {};
  if (productName) {
    contition = {name: new RegExp(`^.*${productName}.*$`)}
  } else if (productDesc) {
    contition = {desc: new RegExp(`^.*${productDesc}.*$`)}
  }
  ProductModel.find(contition)
    .then(products => {
      res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('search products error', error);
      res.send({status: 1, msg: 'search products error, please try again'})
    })
});


// get product by id
router.get('/manage/product/info', (req, res) => {
  const productId = req.query.productId;
  ProductModel.findOne({ _id: productId })
    .then(product => {
      res.send({
        status: 0,
        data: product
      })
    })
    .catch(error => {
      console.error('get product by id error', error);
      res.send({
        status: 1,
        msg: 'get product by id error'
      })
    })
});

// update product
router.post('/manage/product/update', (req, res) => {
  const product = req.body;
  ProductModel.findOneAndUpdate({_id: product._id}, product)
    .then(oldProduct => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('update product', error);
      res.send({status: 1, msg: 'update product error, please try again'})
    })
});

// change product status(in stock/out of stock)
router.post('/manage/product/updateStatus', (req, res) => {
  const {productId, status} = req.body;
  ProductModel.findOneAndUpdate({_id: productId}, {status})
    .then(oldProduct => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('change product status error', error);
      res.send({status: 1, msg: 'change product status error, try it again'})
    })
});


/*
pagination
 */
function pageFilter(arr, pageNum, pageSize) {
  pageNum = pageNum * 1;
  pageSize = pageSize * 1;
  const total = arr.length;
  const pages = Math.floor((total + pageSize - 1) / pageSize);
  const start = pageSize * (pageNum - 1);
  const end = start + pageSize <= total ? start + pageSize : total;
  const list = [];
  for (var i = start; i < end; i++) {
    list.push(arr[i])
  }

  return {
    pageNum,
    total,
    pages,
    pageSize,
    list
  }
}



module.exports = router;