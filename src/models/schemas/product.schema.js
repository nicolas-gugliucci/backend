import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productCollection = 'products'

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        index: true,
        required: true
    },
    thumbnails: {
        type: Array,
        default: undefined
    },
    owner: {
        type: String,
        default: 'admin'
    }
})

productSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, productSchema)