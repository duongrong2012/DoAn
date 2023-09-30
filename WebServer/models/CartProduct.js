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
}, {
    versionKey: false,
    timestamps: true,
}) //khong hien thi version document

cartProductSchema.plugin(mongooseLeanGetters);

const cartProduct = model('cartProducts', cartProductSchema)

module.exports = cartProduct;
