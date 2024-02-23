import mongoose, { Schema } from 'mongoose';

const ticketsSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },

    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: {
        type: String,
        required: true
    },

    purchaser: {
        type: String,
        required: true
    }
})

export const ticketsModel = mongoose.model('Tickets', ticketsSchema);