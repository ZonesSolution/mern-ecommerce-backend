const categoryModel = require('../models/categoryModel')
const slugify = require('slugify')

const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) return res.status(200).send({ success: false, message: 'Category Name Is Required' });
        const existingCategory = await categoryModel.findOne({ name })
        if (existingCategory) return res.status(200).send({ success: false, message: 'Category Exists Already' })
        const category = await new categoryModel({ name, slug: slugify(name) }).save();
        return res.status(201).send({ success: true, message: 'Category added successfully', category })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error Occured While Creating Category',
            error
        })
    }
}

const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        if (!name) return res.status(200).send({ success: false, message: 'Category Name Is Required' });
        const existingCategory = await categoryModel.findOne({ name })
        if (existingCategory) return res.status(200).send({ success: false, message: 'Category Exists Already' })
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        return res.status(200).send({ success: true, message: 'Category updated successfully', category })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error Occured While Updating Category',
            error
        })
    }
}

const getAllCategoryController = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        return res.status(200).send({
            success: true,
            categories
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error Occured While Fetching Categories',
            error
        })
    }
}

const getSingleCategoryController = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryModel.findOne({ slug });
        return res.status(200).send({
            success: true,
            category
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error Occured While Fetching Category',
            error
        })
    }
}

const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id)
        return res.status(200).send({
            success: true,
            message: 'Category Deleted Successfully',
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error Occured While Deleting Category',
            error
        })
    }
}

module.exports = { createCategoryController, updateCategoryController, getAllCategoryController, getSingleCategoryController, deleteCategoryController }