import * as express from 'express';
import { saveFile } from '../../core/helpers/upload-image';
import logger from '../../core/logger/log4js';
import config from '../../../configs';
const uploadRouter = express.Router();

uploadRouter.post('/', saveFile().single('tempimage'), (req, res) => {
    try {
        res.status(200).send({ filepath: req.file.filename });
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
    }
});

export default uploadRouter;
