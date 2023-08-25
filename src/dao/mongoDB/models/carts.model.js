import mongoose from "mongoose";

const cartCollection = 'carts'

const cartSchema = mongoose.Schema({
    products: {
        type: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: { type: Number }
            }
        ],
        default: []
    }
})

export const cartModel = mongoose.model(cartCollection, cartSchema)