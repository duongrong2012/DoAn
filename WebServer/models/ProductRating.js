const { Schema, model } = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');

const productRatingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
    },
    comment: {
        type: String,
        default: '',
        minlength: [10, 'Đánh giá sản phẩm tối thiểu 10 kí tự'],
        maxlength: [300, 'Đánh giá sản phẩm tối đa 500 kí tự'],
    },
    rating: {
        type: Number,
        required: [true, 'Điểm đánh giá là bắt buộc'],
        min: [1, 'Số sao thấp nhất là 1'],
        max: [5, 'Số sao lớn nhất là 5'],
        validate: [
            {
                message: "Số thứ tự phải là số nguyên dương",
                validator: Number.isInteger
            }
        ]

    },
}, {
    versionKey: false,
    timestamps: true,
}) //khong hien thi version document

productRatingSchema.plugin(mongooseLeanGetters);

const ProductRating = model('productRatings', productRatingSchema)

module.exports = ProductRating;
