import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const usersSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Carts",
    },
    role: {
        type: String,
        default: "user",
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    from_github: {
        type: Boolean,
        default: false,
    },
    purchases: {
        type: [{
            cart: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "Carts",
            },
            ticket: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "Tickets",
            }
        }],
        _id: false,
    },
    resetToken: {
        type: String,
    }
})

export const usersModel = mongoose.model('Users', usersSchema);