import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const hashData = async (data) => {
    const hash = await bcrypt.hash(data, 10);
    return hash;
}

export const compareData = async (data, hashData) => {
    return bcrypt.compare(data, hashData);
}

export const generateMock = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: faker.string.uuid(),
        stock: faker.number.int({ min: 1, max: 100 }),
        thumbnail: faker.image.url(),
    };
}
