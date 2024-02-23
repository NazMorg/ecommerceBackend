import { productsService } from '../services/products.service.js'
import { generateMock } from '../utils.js';
import { errorMessages } from '../middlewares/error.enum.js';
import config from '../config/config.js';

class ProductsController {
    findAllProductsAndFilter = async (req, res) => {
        try {
            const products = await productsService.findAllFiltered(req.query);
            if (!products) {
                res.status(400).json({ message: errorMessages.PRODUCTS_NOT_FOUND });
            }
            return res.status(200).json({ message: "Productos encontrados", products: products });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    findProductById = async (req, res) => {
        try {
            const productId = req.params.pid
            const productById = await productsService.findById(productId);
            if (!productById) {
                res.status(400).json({ message: errorMessages.PRODUCT_NOT_FOUND });
            }
            return res.status(200).json({ message: "Producto encontrado", product: productById });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    createProduct = async (req, res) => {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ message: errorMessages.ALL_DATA_IS_REQUIRED });
        }
        if (!thumbnails) {
            delete req.body.thumbnails;
        }
        try {
            const createdProduct = await productsService.createOne(req.body);
            res.status(200).json({ message: "Producto Creado", product: createdProduct });
        } catch (error) {
            res.status(500).json({ error: errorMessages.PRODUCT_NOT_CREATED });
        }
    }

    updateProduct = async (req, res) => {
        try {
            const productId = req.params.pid;
            const productFound = await productsService.findById(productId);
            const activeUser = req.user ? req.user.email : req.session.email;
            if(activeUser === productFound.owner) {
                const productData = req.body;
    
                const updatedProduct = await productsService.updateOne(productId, productData);
                if (!updatedProduct) {
                    res.status(400).json({ message: errorMessages.PRODUCT_NOT_FOUND });
                }
                res.status(200).json({ message: "Producto Actualizado", product: updatedProduct });
            } else {
                res.status(403).json({ message: errorMessages.ACTION_DENIED });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const productId = req.params.pid;
            const productFound = await productsService.findById(productId);
            const activeUser = req.user ? req.user.email : req.session.email;
            if(activeUser === productFound.owner || activeUser === config.adminuser_email) {
                const deletedProduct = await productsService.deleteOne(productId);
    
                if (!deletedProduct) {
                    res.status(400).json({ message: errorMessages.PRODUCT_NOT_DELETED });
                }
                res.status(200).json({ message: "Producto Eliminado", product: deletedProduct });
            } else {
                res.status(403).json({ message: errorMessages.ACTION_DENIED });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    productsMock = async (req, res) => {
        const productsMock = Array.from({ length: 100 }, generateMock);
        res.status(200).json({ message: "Productos simulados", productsMock });
    }
}

export const productsController = new ProductsController();