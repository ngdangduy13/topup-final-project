import * as express from 'express';
import config from '../../../../configs';
import logger from '../../../core/logger/log4js';
import quizzScoreboardService from './quiz-scoreboard/service';
import { validatePagination } from '../../../core/helpers';
import Authorize from '../../../../nextjs/middlewares/authorize';
import totalScoreboardService from './service';

const quizzScoreboardRouter = express.Router();

quizzScoreboardRouter.get('/', Authorize(), async (req, res) => {
    try {
        const result = await totalScoreboardService.findScoreboard(validatePagination(req.query));
        res.status(200).send(result);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
    }
});

quizzScoreboardRouter.post('/', Authorize([config.roles.admin, config.roles.quizzMaster]), async (req: any, res) => {
    try {
        await quizzScoreboardService.createScoreboard(req.body, req.query.profile);
        res.status(200).send(config.responseMessages.Success);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
    }
});
export default quizzScoreboardRouter;
