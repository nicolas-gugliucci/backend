import mongoose from "mongoose";

const messageCollection = 'messages'

const messageSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

export const messageModel = mongoose.model(messageCollection, messageSchema)