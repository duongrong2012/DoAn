const { Schema, model } = require('mongoose');
const yup = require('yup');
const mongooseLeanGetters = require('mongoose-lean-getters');

const categorySchema = new Schema({
    name: {
        trim: true,
        type: String,
        minlength: [1, 'Tên danh mục dùng ít nhất 1 kí tự'],
        maxlength: [50, 'Tên danh mục dùng tối đa 50 kí tự'],
        required: [true, 'Tên danh mục là bắt buộc'],
        validate: {
            message: "Tên danh mục đã tồn tại",
            validator: async (value) => {
                const isCategoryExist = await Category.exists({ name: value })
                return !isCategoryExist
            },
        }
    },
    slug: {
        type: String,
        required: [true, 'Slug là bắt buộc'],
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        default: null,
    }
}, {
    versionKey: false,
    timestamps: true,
}) //khong hien thi version document

categorySchema.plugin(mongooseLeanGetters);

const Category = model('categories', categorySchema)

module.exports = Category;
