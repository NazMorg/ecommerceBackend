import winston from 'winston';
import config from '../config/config.js';

const myLevels = {
    levels:{
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5, 
    },
    colors:{
        fatal: "red",
        error: "red",
        warning: "yellow",
        info: "green",
        http: "grey",
        debug: "cyan"
    },
}

export let logger;

if(config.enviroment === 'desarrollo') {
    logger =  winston.createLogger({
        levels: myLevels.levels,
        transports: [
            new winston.transports.Console({
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({colors: myLevels.colors}),
                    winston.format.simple(),
                )
            }),
            new winston.transports.File({
                level: "error",
                filename: "./error.log",
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.prettyPrint(),
                )
            })
        ]
    }) 
} else if(config.enviroment === 'produccion') {
    logger = winston.createLogger({
        levels: myLevels.levels,
        transports: [
            new winston.transports.Console({
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({colors: myLevels.colors}),
                    winston.format.simple(),
                )
            }),
            new winston.transports.File({
                level: "error",
                filename: "./error.log",
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.prettyPrint(),
                )
            })
        ]
    }) 
}