import { ticketsMongo } from '../daos/tickets.mongo.js';

class TicketsService {
    async findById(id) {
        const response = await ticketsMongo.findById(id);
        return response;
    }
}

export const ticketsService = new TicketsService();