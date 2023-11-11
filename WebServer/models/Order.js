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
    orderDetails: [{
        type: Schema.Types.ObjectId,
        ref: 'orderDetails',
    }],
    deliveryAddress: {
        type: String,
        minlength: [10, 'Địa chỉ giao hàng tối thiểu 10 kí tự'],
        maxlength: [200, 'Địa chỉ giao hàng tối đa 200 kí tự'],
        validate: {
            message: () => 'Địa chỉ không hợp lệ',
            validator: (value) => addressRegExp.test(value)
        },
    },
    status: {
        type: String,
        default: OrderStatus.PROCESSING,
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

const addressRegExp = /^[#.0-9a-zA-Z\s,-]+$/ //chi duoc co dau -

const Order = model('orders', orderSchema)

module.exports = Order;
