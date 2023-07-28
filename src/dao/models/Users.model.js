import mongoose from "mongoose";

const userCollection = 'Users'
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: 'user'
    }
})
const userModel = mongoose.model(userCollection, userSchema)
export default userModel