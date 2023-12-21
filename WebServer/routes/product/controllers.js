const mongoose = require('mongoose');
const getSlug = require('speakingurl');

const Product = require('../../models/Product');
const Category = require('../../models/Category');
const { createResponse, getPaginationConfig } = require('../../utils/helpers/request');
const { getFilePath } = require('../../utils/helpers');
const ProductRating = require('../../models/ProductRating');

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

module.exports.onGetProduct = async (req, res, next) => {
    try {
        const { page, limit } = getPaginationConfig(req, 1, 10)

        const sort = {}

        const filter = {}

        const { keyword } = req.query;

        if (keyword) {
            const serarator = ' ';

            filter.$text = {
                $search: `"${keyword}"`
            };
        }

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

        const totalQuery = Product.countDocuments(filter)

        const productQuery = Product.find(filter)
            .sort(sort)
            .populate("categories")
            .populate("images")
            .skip((page - 1) * limit)
            .limit(limit)
            .lean({ getters: true })

        const [total, products] = await Promise.all([totalQuery, productQuery])

        res.json(createResponse({
            results: products, total
        }))

    } catch (error) {
        next(error)
    }
};


module.exports.onGetProductDetail = async (req, res, next) => {
    try {

        let query

        //id co the truyen la stor id hoac story slug

        if (mongoose.isObjectIdOrHexString(req.params.slug)) {
            query = Product.findById(req.params.slug);
        } else {
            query = Product.findOne({ slug: req.params.slug })
        }

        const productDetail = await query
            .populate("categories")
            .populate("images")
            .lean({ getters: true })

        if (!productDetail) {
            res.status(404).json(createResponse({
                message: "Id hoặc slug không hợp lệ không hợp lệ",
            }));
            return
        }

        res.json(createResponse({
            results: productDetail,
        }))

    } catch (error) {
        next(error)
    }
};

module.exports.onRatingProduct = async (req, res, next) => {
    try {
        let productRating = null

        const productRatingFilter = {
            user: req.user._id,
            product: req.params.id,
        }

        const productRatingModel = {
            user: req.user._id,
            product: req.params.id,
            comment: req.body.comment,
            rating: req.body.rating,
        }

        const updateRatingModel = {
            comment: req.body.comment,
            rating: req.body.rating,
        }

        const userProductRating = await ProductRating.findOne(productRatingFilter)

        if (!userProductRating) {

            productRating = await (await ProductRating.create(productRatingModel))
                .populate("user", "avatar fullName gender")
                .lean({ getters: true })

            await Product.updateOne({
                _id: req.params.id
            }, {
                $inc: {
                    totalRatings: 1,
                    totalRatingPoints: req.body.rating,
                }
            }) //$inc: tang gia tri totallike
        } else {
            productRating = await ProductRating.findOneAndUpdate(
                productRatingFilter,
                updateRatingModel,
                { runValidators: true, new: true }, //new:true gia tri sau update
            ).populate("user", "avatar fullName gender")
                .lean({ getters: true })

            await Product.updateOne({
                _id: req.params.id
            }, {
                $inc: {
                    totalRatingPoints: req.body.rating - userProductRating.rating, //rating moi tru rating cu
                }
            }) //$inc: tang gia tri totallike
        }

        res.json(createResponse({
            results: productRating,
        }))

    } catch (error) {
        next(error)
    }
}

module.exports.onGetProductRating = async (req, res, next) => {
    try {
        const { page, limit } = getPaginationConfig(req, 1, 10)

        const sort = {
            createdAt: -1
        }

        const listRating = await ProductRating.find({
            product: req.params.id,
        })
            .sort(sort)
            .populate("user", "avatar fullName gender")
            .skip((page - 1) * limit)
            .limit(limit)
            .lean({ getters: true })

        res.json(createResponse({
            results: listRating
        }))

    } catch (error) {
        next(error)
    }
}