const slugify = require('slugify')
const productModel = require('../models/productModel')
const categoryModel = require('../models/categoryModel')
const fs = require('fs')

const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        if (!name || !description || !price || !category || !quantity || !photo) res.status(200).send({ success: false, message: 'All Fields Are Required' });
        if (photo && photo.size > 1000000) res.status(200).send({ success: false, message: 'Image size is bigger' });
        const existingProduct = await productModel.findOne({ name })
        if (existingProduct) return res.status(200).send({ success: false, message: 'Another product has same name' })
        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        return res.status(201).send({ success: true, message: 'Product created successfully', products })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error Occured While Creating Product',
            error
        })
    }
}

const updateProductController = async (req, res) => {
    try {
        const { name, description, price, quantity, shipping } = req.fields
        // const { photo } = req.files
        if (!name || !description || !price || !quantity) res.status(200).send({ success: false, message: 'All Fields Are Required' });
        // if (photo && photo.size > 1000000) res.status(200).send({ success: false, message: 'Image size is bigger' });
        const products = await productModel.findByIdAndUpdate(req.params.id, { ...req.fields, slug: slugify(name) }, { new: true })
        // if (photo) {
        //     products.photo.data = fs.readFileSync(photo.path)
        //     products.photo.contentType = photo.type
        // }
        await products.save()
        return res.status(201).send({ success: true, message: 'Product updated successfully', products })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error Occured While Updating Product',
            error
        })
    }
}

const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({ success: true, message: 'Products List', products, count: products.length })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error Occured While Fetching Products',
            error
        })
    }
}

const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate('category')
        return res.status(200).send({ success: true, product })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error Occured While Fetching Product',
            error
        })
    }
}

const getProductPhotoController = async (req, res) => {
    try {
        const id = req.params.id
        const productPhoto = await productModel.findById(id).select('photo')
        if (productPhoto?.photo?.data) {
            res.set('Content-type', productPhoto.photo.contentType)
            return res.status(200).send(productPhoto.photo.data)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error Occured While Fetching Product Photo',
            error
        })
    }
}

const deleteProductController = async (req, res) => {
    try {
        const id = req.params.id
        await productModel.findByIdAndDelete(id).select('-photo')
        return res.status(200).send({ success: true, message: 'Product Deleted Successfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error Occured While Deleting Product',
            error
        })
    }
}

const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success: false,
            message: 'Error Occured While Filtering Products',
            error
        })
    }
}

const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success: false,
            message: 'Error Occured While Counting Products',
            error
        })
    }
}

const productListController = async (req, res) => {
    try {
        const perPage = 6
        const page = req.params.page ? req.params.page : 1
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success: false,
            message: 'Error Occured While Load more Products',
            error
        })
    }
}

const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const searchedProducts = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo")
        res.json(searchedProducts)
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success: false,
            message: 'Error Occured While Searching Product',
            error
        })
    }
}

const categoryWiseProduct = async (req, res) => {
    try {
        const { slug } = req.params
        const category = await categoryModel.findOne({ slug: slug })
        const products = await productModel.find({ category }).populate('category')
        res.status(200).send({
            success: true,
            category,
            products
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success: false,
            message: 'Error Occured While fetching Product',
            error
        })
    }
}

module.exports = { createProductController, getProductController, getSingleProductController, getProductPhotoController, deleteProductController, updateProductController, productFilterController, productCountController, productListController, searchProductController, categoryWiseProduct }