import { Router } from 'express';
import { cartsController } from '../controllers/carts.controller.js';
import { checkUserRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get("/", cartsController.findAllCarts)

router.get("/:cid", cartsController.findCartAndPopulate)

router.post("/", checkUserRole("user"), cartsController.createNewCart)

router.put("/:cid", checkUserRole("user"), cartsController.addProductToCart)

router.delete("/:cid", checkUserRole("user"), cartsController.emptyCart)

router.get("/:cid/purchase", checkUserRole("user"), cartsController.purchaseCart)

router.put("/:cid/products/:pid", checkUserRole("user"), cartsController.updateProductQuantity)

router.delete("/:cid/products/:pid", checkUserRole("user"), cartsController.deleteOneProduct)

export default router;