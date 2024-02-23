import { Router } from 'express';
import { viewsController } from '../controllers/views.controller.js';
import { productsController } from '../controllers/products.controller.js';
import { checkUserRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get("/", viewsController.loginRender)

router.get("/signup", viewsController.signupRender)

router.get("/loginerror", viewsController.loginErrorRender)

router.get("/registererror", viewsController.registerErrorRender)

router.get("/forgotpassword", viewsController.forgotPassRender)

router.get("/products", viewsController.productsRender)

router.get("/carts/:cid", viewsController.populatedCartRender)

router.get("/products/:pid", viewsController.productDetailsRender)

router.get("/createproduct", checkUserRole("admin"), viewsController.createProductRender)

router.get("/updateproduct", checkUserRole("admin"), viewsController.updateProductRender)

router.get("/deleteproduct", checkUserRole("admin"), viewsController.deleteProductRender)

router.get("/mockingproducts", productsController.productsMock)

export default router;