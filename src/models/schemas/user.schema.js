import mongoose from "mongoose";

const userCollection = 'Users'
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    age: {
        type: Number
    },
    documents: [
        {
            name: {
                type: String,
            },
            reference:{
                type: String,
            }
        }
    ],
    last_connection: {
        type: Date,
        default: null,
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    cart:{
        type: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'carts'
        }],
        default: []
    },
    gitId: {
        type: String,
    },
    status:{
        identificacion: {
            type: Boolean,
            default: false
        },
        comprobante_domicilio: {
            type: Boolean,
            default: false
        },
        comprobante_estado_cuenta: {
            type: Boolean,
            default: false
        },
    }
})

export const userModel = mongoose.model(userCollection, userSchema)