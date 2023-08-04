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
        required: true
    },
    age: {
        type: Number
    },
    salt: {
        type: String
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
    },
    gitId: {
        type: String,
    }
})
const userModel = mongoose.model(userCollection, userSchema)
export default userModel