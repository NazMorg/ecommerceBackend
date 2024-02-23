import { usersMongo } from '../daos/users.mongo.js';
import { cartsMongo } from '../daos/carts.mongo.js';
import { hashData } from '../utils.js';
import config from '../config/config.js';

class UsersService {
    async findAll() {
        const response = await usersMongo.findAll();
        return response;
    }

    async findById(id) {
        const response = await usersMongo.findById(id);
        return response;
    }

    async findByEmail(email) {
        const response = await usersMongo.findByEmail(email);
        return response;
    }

    async createOne(obj) {
        const { email, password } = obj;
        const hashedPass = await hashData(password);
        const isAdmin = email === config.adminuser_email && password === config.adminuser_pass ? true : false;
        const role = isAdmin === true ? "admin" : "user";
        const userCart = await cartsMongo.createOne({ products: [] });
        const response = await usersMongo.createOne({ ...obj, password: hashedPass, cart: userCart, role: role });
        return response;
    }

    async updateOne(id, obj) {
        const userId = id;
        const userData = obj;
        const response = await usersMongo.updateOne(userId, userData);
        return response;
    }

    async deleteOne(id) {
        const response = await usersMongo.deleteOne(id);
        return response;
    }

    async findByToken(token) {
        const response = await usersMongo.findByToken(token);
        return response;
    }

}

export const usersService = new UsersService();