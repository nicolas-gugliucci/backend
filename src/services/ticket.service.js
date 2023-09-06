import ticketDAO from "../models/daos/mongoDB/ticket.dao.js"

const dao = new ticketDAO()

export default class TicketService{
    async getTickets(){
        const tickets = await dao.getTickets()
        return tickets
    }

    async generateTicket(amount, purchaser) {
        const tickets = this.getTickets()
        const code = tickets.length !== 0 ? tickets[tickets.length - 1].code + 1 : 0
        const ticket = {amount, purchaser, purchase_datetime: new Date(), code: code} 
        console.log(ticket)
        const result = await dao.generate(ticket)
        return result
    }
}