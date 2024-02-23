import { cartsService } from '../services/carts.service.js';
import { ticketsService } from '../services/tickets.service.js';
import { usersService } from '../services/users.service.js';
import { errorMessages } from '../middlewares/error.enum.js';

class CartsController {
    findAllCarts = async (req, res) => {
        try {
            const carts = await cartsService.findAll()
            if (!carts) {
                res.status(400).json({ message: errorMessages.CARTS_NOT_FOUND });
            }
            return res.status(200).json({ message: "Carritos encontrados", carts: carts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    findCartAndPopulate = async (req, res) => {
        const cartId = req.params.cid;
        try {
            const cartById = await cartsService.findAndPopulate(cartId)
            if (!cartById) {
                res.status(400).json({ message: errorMessages.CART_NOT_FOUND });
            }
            return res.status(200).json({ message: "Carrito encontrado", cart: cartById });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    createNewCart = async (req, res) => {
        const { productId, quantity } = req.body;
        const obj = { products: [{ product: productId, quantity: quantity }] };
        try {
            const newCart = await cartsService.createOne(obj)
            if (!newCart) {
                res.status(400).json({ message: errorMessages.CART_NOT_CREATED });
            }
            return res.status(200).json({ message: "Carrito creado", cart: newCart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    addProductToCart = async (req, res) => {
        const cartId = req.params.cid;
        const productsData = req.body;
        try {
            const updatedCart = await cartsService.addToCart(cartId, productsData)
            if (!updatedCart) {
                res.status(400).json({ message: errorMessages.PRODUCT_NOT_ADDED });
            }
            return res.status(200).json({ message: "Carrito actualizado", cart: updatedCart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    emptyCart = async (req, res) => {
        const cartId = req.params.cid;
        try {
            const emptyCart = await cartsService.deleteAllProducts(cartId)
            if (!emptyCart) {
                res.status(400).json({ message: errorMessages.CART_NOT_CLEARED });
            }
            return res.status(200).json({ message: "Productos eliminados del carrito", cart: emptyCart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    updateProductQuantity = async (req, res) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        try {
            const cartUpdate = await cartsService.updateProductQuantity(cartId, productId, quantity)
            if (!cartUpdate) {
                res.status(400).json({ message: errorMessages.QUANTITY_NOT_UPDATED });
            }
            return res.status(200).json({ message: "Cantidad Actualizada", cart: cartUpdate });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    deleteOneProduct = async (req, res) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const cartUpdate = await cartsService.deleteOneProduct(cartId, productId)
            if (!cartUpdate) {
                res.status(400).json({ message: errorMessages.PRODUCT_NOT_DELETED });
            }
            return res.status(200).json({ message: "Producto eliminado", cart: cartUpdate });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    purchaseCart = async (req, res) => {
        const cartId = req.params.cid;

        try {
            const cartUpdate = await cartsService.purchaseCart(cartId);
            if (!cartUpdate) {
                res.status(400).json({ message: "Error de compra" });
            }
            
            return res.status(200).json({ message: "Compra realizada", cart: cartId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const cartsController = new CartsController();