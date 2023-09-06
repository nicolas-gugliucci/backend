import mongoose from "mongoose";

const ticketCollection = 'Tickets'
const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        uniqued: true,
        required: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
})
const ticketModel = mongoose.model(ticketCollection, ticketSchema)
export default ticketModel