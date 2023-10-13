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
    // salt: {
    //     type: String
    // },
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
    }
})

export const userModel = mongoose.model(userCollection, userSchema)