const express = require('express')
const { verifyToken, isAdmin } = require('../middlewares/auth')
const { createCategoryController, updateCategoryController, getAllCategoryController, getSingleCategoryController, deleteCategoryController } = require('../controllers/categoryController')
const router = express.Router()

//create a new category
router.post('/create-category', verifyToken, isAdmin, createCategoryController);

//update category
router.put('/update-category/:id', verifyToken, isAdmin, updateCategoryController);

//get all categories
router.get('/', getAllCategoryController);

//get a single category
router.get('/:slug', getSingleCategoryController);

//delete category
router.delete('/:id', verifyToken, isAdmin, deleteCategoryController)


module.exports = router