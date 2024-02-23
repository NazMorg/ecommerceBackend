import BaseMongo from './base.mongo.js';
import { cartsModel } from '../models/carts.model.js';
import { productsModel } from '../models/products.model.js';
import { usersModel } from '../models/users.model.js';
import { ticketsModel } from '../models/tickets.model.js';

class CartsMongo extends BaseMongo {
    constructor() {
        super(cartsModel, "products.product");
    }

    async findAndPopulate(cid) {
        const cartFound = await cartsModel.findById(cid).populate("products.product").lean();
        return cartFound;
    }

    async addToCart(cid, obj) {
        const cartFound = await cartsModel.findById(cid);
        if (!cartFound) {
            const cartFound = await cartsModel.create({ products: [] });
            cartFound.products = [...cartFound.products, ...obj.products];
        } else {
            cartFound.products = [...cartFound.products, ...obj.products];
        }
        cartFound.save();
        return cartFound;
    }

    async deleteAllProducts(cid) {
        const cartFound = await cartsModel.findById(cid);
        if (!cartFound) {
            console.log(`No se encontro el carrito: ${cid}`);
        } else {
            cartFound.products = [];
        }
        cartFound.save();
        return cartFound;
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cartFound = await cartsModel.findById(cid);
        const productFound = cartFound.products.find((product) => product.product.toString() === pid);

        if (!productFound) {
            console.log("No se encontro el producto");
        } else {
            productFound.quantity = quantity;
        }
        cartFound.save();
        return cartFound;
    }

    async deleteOneProduct(cid, pid) {
        const cartFound = await cartsModel.findById(cid);
        const productFound = cartFound.products.find((product) => product.product.toString() === pid);

        if (!productFound) {
            console.log("No se encontro el producto");
        } else {
            cartFound.products = cartFound.products.filter((product) => product.product.toString() !== pid);
        }
        cartFound.save();
        return cartFound;
    }

    async purchaseCart(cid) {
        try {
            //cart check
            const cartFound = await cartsModel.findById(cid);
            if (!cartFound) {
                return console.log("Carrito no encontrado");
            }
            if (cartFound.products.length === 0) {
                return console.log("El carrito esta vacío");
            }

            //user check
            const purchaser = await usersModel.findOne({ cart: cid }).select("email");

            if (!purchaser) {
                return console.log("No se encontro el usuario");
            }

            const userEmail = purchaser.email;

            //products-ticket cycle
            const confirmedProducts = []; //productos con stock confirmado
            let totalPurchasePrice = 0; //variable para calculo de precio total
            const deniedProducts = []; //productos sin stock suficiente

            for (const productInCart of cartFound.products) {
                const productData = await productsModel.findById(productInCart.product).lean();

                //product check
                if (!productData) {
                    console.log(`Producto con ID ${productInCart.product} no encontrado`);
                    continue;
                }

                //stock check
                const databaseProductStock = productData.stock;

                if (productInCart.quantity <= databaseProductStock) {
                    confirmedProducts.push({
                        product: productInCart.product,
                        quantity: productInCart.quantity,
                        productInfo: {
                            title: productData.title,
                            price: productData.price,
                        },
                    });
                    totalPurchasePrice += productInCart.quantity * productData.price;
                    console.log(`Precio Total: ${totalPurchasePrice}`);
                } else {
                    console.log("El producto no tiene stock suficiente");
                    deniedProducts.push({
                        product: productInCart.product,
                        quantity: productInCart.quantity,
                    });
                }
            }

            //update cart status
            cartFound.status = "closed"
            cartFound.save();

            //stock update
            for (const productInCart of cartFound.products) {
                const product = await productsModel.findById(productInCart.product);
                if (product) {
                    product.stock -= productInCart.quantity;
                    if(product.stock < 0) {
                        product.stock = 0;
                        await product.save();
                    }
                    await product.save();
                }
            }

            //ticket code
            function generateCode() {
                const timestamp = new Date().getTime();
                const random = Math.random().toString(36).substring(2, 8);
                const uniqueCode = `${timestamp}-${random}`;
                return uniqueCode;
            }

            //ticket generation
            const ticketData = {
                code: generateCode(),
                purchase_datetime: new Date(),
                amount: totalPurchasePrice,
                purchaser: userEmail,
            }

            const newTicket = await ticketsModel.create(ticketData);

            const purchaseData = {
                cart: cid,
                ticket: newTicket._id,
            }
            console.log(purchaseData)

            //nuevo cart para productos denegados
            if (deniedProducts.length > 0) {
                const newCart = await cartsModel.create({ products: deniedProducts });

                //user update
                const userFound = await usersModel.findById(purchaser._id);
                userFound.purchases.push(purchaseData);
                userFound.cart = newCart._id;
                userFound.save()
            } else {
                const newCart = await cartsModel.create({ products:[] });

                const userFound = await usersModel.findById(purchaser._id);
                userFound.purchases.push(purchaseData);
                userFound.cart = newCart._id;
                userFound.save()
            }


            //return
            return {
                newTicket,
                status: "success",
                message: "Compra Formalizada",
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const cartsMongo = new CartsMongo();