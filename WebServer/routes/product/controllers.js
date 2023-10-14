const mongoose = require('mongoose');
const getSlug = require('speakingurl');

const Product = require('../../models/Product');
const Category = require('../../models/Category');
const { createResponse, getPaginationConfig } = require('../../utils/helpers/request');
const { getFilePath } = require('../../utils/helpers');
const { ProductImage, imageType } = require('../../models/ProductImage');

module.exports.onCreateCategory = async (req, res, next) => {
    try {
        const category = {
            name: req.body.name,
            slug: getSlug(req.body.name)
        }

        if (req.body.parentCategory) {
            category.parentCategory = req.body.parentCategory
        }

        if (req.file) {
            category.image = getFilePath(req.file)
        }

        await Category.create(category)

        res.json(createResponse())

    } catch (error) {
        next(error)
    }
};

module.exports.onGetCategory = async (req, res, next) => {
    try {
        const categories = await Category.find({}).lean({ getters: true })

        res.json(createResponse({
            results: categories
        }))

    } catch (error) {
        next(error)
    }
};

module.exports.onCreateProduct = async (req, res, next) => {
    try {
        const product = {
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
            description: req.body.description,
            slug: getSlug(`${req.body.name}-${Date.now()}`)
        }

        if (req.body.categories instanceof Array) {
            product.categories = [...new Set(req.body.categories)]
        }

        if (req.files.length !== 4) {
            res.json(createResponse({
                message: "số file ảnh phải bằng 4"
            }))
            return
        }
        const productId = new mongoose.Types.ObjectId()

        product._id = productId

        const promises = req.files.map((item, index) => {
            const type = index === 0 ? imageType.COVER_IMAGE : imageType.SLIDE_IMAGES

            return ProductImage.create({ productId, type, url: getFilePath(item) })
        })

        const images = await Promise.all(promises)

        product.images = images.map((item) => item._id)

        await Product.validate(product, ["name", "quantity", "price", "description", "slug", "uploader"])

        await Product.create(product)

        await Category.updateMany({
            _id: { $in: product.categories }
        }, { $inc: { productCount: 1 } })

        res.json(createResponse())

    } catch (error) {
        next(error)
    }
};

module.exports.onGetProduct = async (req, res, next) => {
    try {
        const { page, limit } = getPaginationConfig(req, 1, 10)

        const sort = {}

        const filter = {}

        if (req.query.sort && req.query.sort === 'createdAt') {
            sort.createdAt = -1 //1:ascending -1:descending
        }

        if (req.query.sort && req.query.sort === 'totalSold') {
            sort.totalSold = -1 //1:ascending -1:descending
        }

        if (req.query.category) {
            const categories = await Category.find({ slug: req.query.category })

            filter.categories = { $in: categories.map((item) => item._id) }
        }

        const product = await Product.find(filter)
            .sort(sort)
            .populate("categories")
            .populate("images")
            .skip((page - 1) * limit)
            .limit(limit)
            .lean({ getters: true })

        res.json(createResponse({
            results: product
        }))

    } catch (error) {
        next(error)
    }
};