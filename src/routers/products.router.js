import { Router } from 'express';
import { productsController } from '../controllers/products.controller.js';
import { checkUserRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get("/", productsController.findAllProductsAndFilter)

router.get("/:pid", productsController.findProductById)

router.post("/", checkUserRole('admin'), productsController.createProduct)

router.put("/:pid", checkUserRole('admin'), productsController.updateProduct)

router.delete("/:pid", checkUserRole('admin'), productsController.deleteProduct)

export default router;