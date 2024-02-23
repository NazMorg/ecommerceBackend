import { usersService } from '../services/users.service.js';
import { errorMessages } from '../middlewares/error.enum.js';
import { hashData, compareData } from '../utils.js';
import Jwt from 'jsonwebtoken';
import config from '../config/config.js';

class UsersController {
    userSignup = async (req, res) => {
        const { first_name, last_name, email, age, password } = req.body;
        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ error: errorMessages.ALL_DATA_IS_REQUIRED });
        }
        const createdUser = await usersService.createOne(req.body);
        if (!createdUser) {
            res.redirect("/signup");
        }
        res.status(200).redirect("/");
    }

    userLogout = (req, res) => {
        req.session.destroy(() => {
            res.redirect("/");
        });
    }

    getPremium = async (req, res) => {
        try {
            const userId = req.params.uid;
            const newUserStatus = req.body;
            const userFound = await usersService.findById(userId);
            userFound.isPremium = newUserStatus.isPremium;
            const updatedUserData = { ...userFound };

            const updatedUser = await usersService.updateOne(userId, updatedUserData);
            if (!updatedUser) {
                res.status(400).json({ message: errorMessages.USER_NOT_UPDATED });
            }
            res.status(200).json({ message: "Usuario Actualizado" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    getResetToken = async (req, res) => {
        try {
            //encontrar user
            const userEmail = req.params.email;
            console.log(userEmail)
            const userFound = await usersService.findByEmail(userEmail);
            console.log(userFound)

            if(!userFound) {
                res.status(400).json({ message: errorMessages.USER_NOT_FOUND });
            }
            const userId = userFound._id

            //generar token
            const token = Jwt.sign({ userId: userId, email: userFound.email }, config.jwt_secret, { expiresIn: '60m' });
            if(!token) {
                res.status(400).json({ message: "Error generando el token" });
            }

            //actualizar user
            userFound.resetToken = token;
            const updatedUserData = { ...userFound };
            const updatedUser = await usersService.updateOne(userId, updatedUserData);
            if (!updatedUser) {
                res.status(400).json({ message: errorMessages.USER_NOT_UPDATED });
            }
            //generar link de recuperacion
            const link = `http://localhost:8080/api/users/new-password/${token}`;
            //enviar email con token
            res.status(200).json({ message: "Usuario Actualizado", changePassLink: link });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const usersController = new UsersController();