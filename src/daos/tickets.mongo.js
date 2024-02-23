import BaseMongo from './base.mongo.js';
import { ticketsModel } from '../models/tickets.model.js';

class TicketsMongo extends BaseMongo {
    constructor() {
        super(ticketsModel)
    }
}

export const ticketsMongo = new TicketsMongo();