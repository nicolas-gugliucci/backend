import ticketModel from '../../schemas/ticket.schema.js'

export default class ticketDAO {
  
    async generate(ticket) {
        try {
            await ticketModel.create(ticket)
        } catch (error) {
            return { message: error.message, error: error.name }
        }
        return 1
    }
    async getTickets() {
        try {
            const tickets = await productModel.find().lean()
            return tickets
        } catch (error) {
            return { message: error.message, error: error.name }
        }
    }
}