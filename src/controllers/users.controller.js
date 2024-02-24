import { usersService } from '../services/users.service.js';
import { errorMessages } from '../middlewares/error.enum.js';
import { hashData, compareData } from '../utils.js';
import { transporter } from '../utils/nodemailer.js';
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
            const userFound = await usersService.findByEmail(userEmail);

            if (!userFound) {
                res.status(400).json({ message: errorMessages.USER_NOT_FOUND });
            }
            const userId = userFound._id

            //generar token
            const token = Jwt.sign({ userId: userId, email: userFound.email }, config.jwt_secret, { expiresIn: '60m' });
            if (!token) {
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
            const link = `http://localhost:8080/changepassword/${token}`;

            //enviar email con token
            const mailOptions = {
                from: "ecommerce",
                to: userEmail,
                subject: "Restablecimiento de Contraseña",
                text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${link}`,
            };
            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: "Email enviado" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    updatePass = async (req, res) => {
        //extraer token y buscar user
        const receivedToken = req.params.token;
        const { pass } = req.body;
        const userFound = await usersService.findByToken(receivedToken);
        let isUpdated = false;
        const expiredRedirect = "http://localhost:8080/forgotpassword";

        try {
            //verificacion de token
            Jwt.verify(receivedToken, config.jwt_secret, (err, decoded) => {
                if (err) {
                    //token no valido
                    console.log("Token no valido", err);
                    userFound.resetToken = "";
                    userFound.save();
                    isUpdated = true;
                    if (isUpdated) {
                        res.status(401).json({ message: "Su link a expirado, dirijase al siguiente link para generar uno nuevo", link: expiredRedirect });
                    }
                } else {
                    //verificacion de expiracion de token
                    const isExpired = decoded.exp < Date.now() / 1000;
                    if (isExpired) {
                        res.status(401).json({ message: "Su link a expirado, dirijase al siguiente link para generar uno nuevo", link: expiredRedirect });
                    }
                }
            })
            //comparar pass nueva con antigua
            const comparation = await compareData(pass, userFound.password);
            if (comparation) {
                res.status(403).json({ message: "La nueva contraseña no puede ser igual a la anterior" });
            } else {
                userFound.password = await hashData(pass);
                userFound.resetToken = "";
                userFound.save();
                res.status(200).json({ message: "Se a actualizado su contraseña" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
}

export const usersController = new UsersController();