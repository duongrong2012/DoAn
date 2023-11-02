const { Schema, model } = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');

const cartProductSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
    },
    quantity: {
        type: Number,
        min: [0, 'Số lượng thấp nhất là 0'],
        default: 0,
        validate: [
            {
                message: "Số lượng phải là số nguyên dương",
                validator: Number.isInteger
            },
        ]
    },
}, {
    versionKey: false,
    timestamps: true,
}) //khong hien thi version document

cartProductSchema.plugin(mongooseLeanGetters);

const CartProduct = model('cartProducts', cartProductSchema)

module.exports = CartProduct;
