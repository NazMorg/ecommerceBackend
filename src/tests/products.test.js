import { expect } from 'chai';
import { productsMongo } from '../daos/products.mongo.js';
import '../config/dbConfig.js';

describe("Get products", function () {
    it("Should return an array of products", async function () {
        const result = await productsMongo.findAll();
        expect(result).to.be.an("array");
    })
})