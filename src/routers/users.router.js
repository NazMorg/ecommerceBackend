import { Router } from 'express';
import { usersController } from '../controllers/users.controller.js';

const router = Router();

router.post("/signup", usersController.userSignup)

router.get("/logout", usersController.userLogout)

router.put("/:uid", usersController.getPremium)

router.put("/forgotpassword/:email", usersController.getResetToken)

export default router;