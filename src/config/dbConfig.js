import mongoose from 'mongoose';
import config from './config.js';
import { logger } from '../utils/winston.js';

const URI = config.mongo_uri;

mongoose.connect(URI)
    .then(() => logger.debug("DB Conectada..."))
    .catch((error) => console.log(error));