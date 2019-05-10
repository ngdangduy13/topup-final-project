import * as express from 'express';
import logger from '../../core/logger/log4js';
import config from '../../../configs';
import * as path from 'path';

const uploadRouter = express.Router();

uploadRouter.post('/', (req, res) => {
    try {
        let file = (req.files as any).file;

        let pathFile = `../../../static/temps/images/${file.name}`;
        const fileFolder = path.join(__dirname, pathFile);

        file.mv(fileFolder, (err: any) => {
            if (err) {
                res.status(500).send(err);
            }

            res.json({ file: `/static/temps/images/${file.name}` });
        });
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
    }
});

export default uploadRouter;
