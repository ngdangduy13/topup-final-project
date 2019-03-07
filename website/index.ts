import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as cors from 'cors';
import { bootstrapNextjs } from './nextjs/bootstrapNextjs';
import apiRouter from './api';
import config from './configs';
import logger from './api/core/logger/log4js';

const bootstrap = async () => {
    const port = parseInt(process.env.PORT ? process.env.PORT : '', 10) || 3000;
    const server = express();

    // Connect To MongoDB
    await mongoose.connect(
        config.database.mongoConnectionString,
        { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false },
    );

    // Middleware
    server.use(
        cors({
            origin: config.nextjs.corsOrigin,
            credentials: true,
        }),
    );

    server.use(bodyParser.json({ limit: '50mb' }));
    server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    server.use(cookieParser());
    server.use(
        session({
            secret: 'techkids',
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: true,
                maxAge: 60000,
            },
        }),
    );

    await bootstrapNextjs(server);
    server.use('/api', apiRouter);

    await server.listen(port, () => {
        logger.info(`🚀  Server ready at ${config.nextjs.apiUrl}`);
    });

    process.on('SIGINT', () => {
        /* tslint:disable-next-line:no-console */
        console.log(`\nShutting down the server...Goodbye.\n`);
        process.exit();
    });
};

bootstrap();
