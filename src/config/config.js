import dotenv from 'dotenv';

dotenv.config();

export default {
    mongo_uri: process.env.MONGO_URI,
    port: process.env.PORT,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    github_callback_url: process.env.GITHUB_CALLBACK_URL,
    session_secret: process.env.SESSION_SECRET_KEY,
    adminuser_email: process.env.ADMINUSER_EMAIL,
    adminuser_pass: process.env.ADMINUSER_PASS,
    gmail_user: process.env.GMAIL_USER,
    gmail_pass: process.env.GMAIL_PASS,
    jwt_secret: process.env.JWT_SECRET,
    jwt_reset_secret: process.env.JWT_RESET_SECRET,
    enviroment: process.env.ENVIROMENT,
}