import winston from 'winston'
import { LOGGER_LEVEL, environment } from '../config/config.js'

const levelOptions={
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5,
    },
    colors:{
        fatal:'magenta',
        error: 'red',
        warning: 'yellow',
        info:'cyan',
        http:'white',
        debug:'grey',
    }
}

const developmentLogger = winston.createLogger({

    levels: levelOptions.levels,
    level: LOGGER_LEVEL,

    transports:[

        new winston.transports.Console({ 
            level : LOGGER_LEVEL,
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.colors}),
                winston.format.simple()
            )     
        }),

    ]
})

const productionLogger = winston.createLogger({

    levels: levelOptions.levels,
    level: LOGGER_LEVEL,

    transports:[

        new winston.transports.Console({ 
            level : LOGGER_LEVEL,
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.colors}),
                winston.format.simple()
            )     
        }),

        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })

    ]
})

export const addLogger =(req,res,next)=>{
    
    if(environment.toUpperCase() === 'PRODUCTION'){
        req.logger = productionLogger
    }else if(environment.toUpperCase() === 'DEVELOPMENT'){
        req.logger = developmentLogger
    }
    next();
}