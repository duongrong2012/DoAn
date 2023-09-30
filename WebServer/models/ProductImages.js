const { Schema, model } = require('mongoose');
const yup = require('yup');
const mongooseLeanGetters = require('mongoose-lean-getters');

function posterGetter(value) {
    return `${process.env.HOST}${value}`
}

const productImageSchema = new Schema({
    url: {
        type: String,
        required: [true, 'Ảnh là bắt buộc'],
        get: posterGetter,
    },
    type: {
        type: String,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'products',
    }
}, {
    versionKey: false,
    timestamps: true,
}) //khong hien thi version document

productImageSchema.plugin(mongooseLeanGetters);

const ProductImage = model('productImages', productImageSchema)

module.exports = ProductImage;
