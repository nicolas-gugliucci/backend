import ticketModel from '../../schemas/ticket.schema.js'

export default class ticketDAO {
  
    async generate(ticket) {
        let ticketResponse
        try {
            ticketResponse = await ticketModel.create(ticket)
        } catch (error) {
            return { message: error.message, error: error.name }
        }
        return {error:1,ticket: ticketResponse}
    }
    async getTickets() {
        try {
            const tickets = await ticketModel.find().lean()
            return tickets
        } catch (error) {
            return { message: error.message, error: error.name }
        }
    }
}