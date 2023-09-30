const { Schema, model } = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');
const Category = require('./Category');


const productSchema = new Schema({
    name: {
        trim: true,
        type: String,
        minlength: [1, 'Tên sản phẩm dùng ít nhất 1 kí tự'],
        maxlength: [100, 'Tên sản phẩm dùng tối đa 100 kí tự'],
        required: [true, 'Tên sản phẩm là bắt buộc'],
        validate: {
            message: "Tên sản phẩm đã tồn tại",
            validator: async (value) => {
                const isProductExist = await Product.exists({ name: value })
                return !isProductExist
            },
        }
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'category',
        validate: {
            message: "Danh mục không hợp lệ",
            validator: async (value) => {
                const isCategoryExist = await Category.exists({ _id: value })
                return isCategoryExist
            },
        }
    }],
    totalRatings: {
        type: Number,
        default: 0,
    },
    totalRatingPoints: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: String,
        required: [true, 'Số lượng là bắt buộc'],
        min: [0, 'Số lượng thấp nhất là 0'],
        validate: [
            {
                message: "Số lượng phải là số nguyên dương",
                validator: Number.isInteger
            },
        ]
    },
    price: {
        type: String,
        required: [true, 'Giá tiền là bắt buộc'],
        min: [0, 'Giá tiền thấp nhất là 0'],
        validate: [
            {
                message: "Giá tiền phải là số nguyên dương",
                validator: Number.isInteger
            },
        ]
    },
    description: {
        type: String,
        minlength: [1, 'Mô tả dùng ít nhất 1 kí tự'],
        maxlength: [2000, 'Mô tả dùng tối đa 2000 kí tự'],
        required: [true, 'Mô tả là bắt buộc'],
    },
    slug: {
        type: String,
        required: [true, 'slug là bắt buộc'],
    },
}, {
    versionKey: false,
    timestamps: true,
}) //khong hien thi version document

productSchema.plugin(mongooseLeanGetters);

const Product = model('products', productSchema)

module.exports = Product;
