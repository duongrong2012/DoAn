const { Schema, model } = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');

const OrderStatus = {
    PROCESSING: 'PROCESSING',
    DELIVERING: 'DELIVERING',
    DELIVERED: 'DELIVERED',
}

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    deliveryAddress: {
        type: String,
        minlength: [10, 'Địa chỉ giao hàng tối thiểu 10 kí tự'],
        maxlength: [200, 'Địa chỉ giao hàng tối đa 200 kí tự'],
    },
    status: {
        type: String,
        enum: {
            values: Object.keys(OrderStatus),
            message: 'Trạng thái đơn hàng không hợp lệ'
        }
    },
}, {
    versionKey: false,
    timestamps: true,
}) //khong hien thi version document

orderSchema.plugin(mongooseLeanGetters);

const Order = model('orders', orderSchema)

module.exports = Order;
