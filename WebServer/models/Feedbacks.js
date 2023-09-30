const { Schema, model } = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');

const FeedbackSchema = new Schema({
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'admins',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    userFeedback: {
        type: String,
        default: '',
        minlength: [10, 'người dùng phản hồi tối thiểu 10 kí tự'],
        maxlength: [300, 'người dùng phản hồi tối đa 500 kí tự'],
    },
    adminResponse: {
        type: String,
        default: '',
        minlength: [10, 'người quản lý trả lời tối thiểu 10 kí tự'],
        maxlength: [300, 'người quản lý trả lời tối đa 500 kí tự'],
    },
}, {
    versionKey: false,
    timestamps: true,
}) //khong hien thi version document

FeedbackSchema.plugin(mongooseLeanGetters);

const Feedback = model('feedbacks', FeedbackSchema)

module.exports = Feedback;
