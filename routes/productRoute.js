const express = require('express')
const { verifyToken, isAdmin } = require('../middlewares/auth')
const { createProductController, getProductController, getSingleProductController, getProductPhotoController, deleteProductController, updateProductController, productFilterController, productCountController, productListController, searchProductController, categoryWiseProduct } = require('../controllers/productController')
const formidable = require('express-formidable')
const router = express.Router()

//create product
router.post('/create-product', verifyToken, isAdmin, formidable(), createProductController)

//get products
router.get('/get-products', getProductController)

//get single product
router.get('/get-product/:slug', getSingleProductController)

//get photo for product
router.get('/get-product-photo/:id', getProductPhotoController)

//delete product
router.delete('/delete-product/:id', verifyToken, isAdmin, deleteProductController)

//update product
router.put('/update-product/:id', verifyToken, isAdmin, formidable(), updateProductController)

//filter product
router.post('/product-filters', productFilterController)

//product count functionality
router.get('/product-count', productCountController)

//product per page
router.get('/product-list/:page', productListController)

//search product
router.get('/search-product/:keyword', searchProductController)

//product category wise
router.get('/product-category/:slug', categoryWiseProduct)

module.exports = router