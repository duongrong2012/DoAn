const { Schema, model } = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');

const orderDetailSchema = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'orders',
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
    },
    name: {
        trim: true,
        type: String,
        minlength: [1, 'Tên sản phẩm dùng ít nhất 1 kí tự'],
        maxlength: [100, 'Tên sản phẩm dùng tối đa 100 kí tự'],
        required: [true, 'Tên sản phẩm là bắt buộc'],
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'category',
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
        type: Number,
        required: [true, 'Số lượng là bắt buộc'],
        min: [1, 'Số lượng thấp nhất là 1'],
        validate: [
            {
                message: "Số lượng phải là số nguyên dương",
                validator: Number.isInteger
            },
        ]
    },
    price: {
        type: Number,
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
        maxlength: [10000, 'Mô tả dùng tối đa 10000 kí tự'],
        required: [true, 'Mô tả là bắt buộc'],
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'productImages',
    }],
}, {
    versionKey: false,
    timestamps: true,
}) //khong hien thi version document

orderDetailSchema.plugin(mongooseLeanGetters);

const OrderDetail = model('orderDetails', orderDetailSchema)

module.exports = OrderDetail;
