import * as express from 'express';
import logger from '../../core/logger/log4js';
import quizzService from './service';
import { validatePagination, addCreationAuditInfo, addModificationAuditInfo } from '../../core/helpers';
import config from '../../../configs';
import { IUpdateQuizzInput } from './interface';
import Authorize from '../../../nextjs/middlewares/authorize';
import quizzScoreBoard from './total-scoreboard/quiz-scoreboard/service';

const quizzesRouter = express.Router();

quizzesRouter.get('/', Authorize(), async (req: any, res) => {
    try {
        const results = await quizzService.findQuizzes(validatePagination(req.query));
        res.status(200).send(results);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
    }
});

quizzesRouter.post('/', Authorize([config.roles.admin, config.roles.quizzMaster]), async (req: any, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            res.status(400).send(config.responseMessages.BadRequest);
            return;
        }
        const results = await quizzService.createQuizz(addCreationAuditInfo(req.query.profile, req.body));
        res.status(200).send(results);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
    }
});

quizzesRouter.delete('/:id', Authorize([config.roles.admin, config.roles.quizzMaster]), async (req: any, res) => {
    try {
        await quizzService.deactivateQuizz(addModificationAuditInfo(req.query.profile, { id: req.params.id }));
        res.status(200).send(config.responseMessages.Success);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
    }
});

quizzesRouter.put('/:id', Authorize([config.roles.admin, config.roles.quizzMaster]), async (req: any, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            res.status(400).send(config.responseMessages.BadRequest);
            return;
        }
        const body: IUpdateQuizzInput = addModificationAuditInfo(req.query.profile, req.body);
        body._id = req.params.id;
        await quizzService.updateQuizz(body);
        res.status(200).send(config.responseMessages.Success);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
    }
});

quizzesRouter.get('/:id', Authorize(), async (req, res) => {
    try {
        const result = await quizzService.findQuizzById(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
    }
});

// quizzesRouter.post('/uploadImage', saveFile().single('tempimage'), (req, res) => {
//     try {
//         res.send(`${config.nextjs.hostUrl}static/temps/images/${req.file.filename}`);
//     } catch (error) {
//         logger.error(`${error.message} ${error.stack}`);
//         res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
//     }
// });

quizzesRouter.post('/submitanswers', Authorize(), async (req: any, res) => {
    try {
        logger.info(req.query.profile);
        const result = await quizzService.submitAnswer(req.body, req.query.profile);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
    }
});

quizzesRouter.get('/:id/activate', Authorize([config.roles.admin, config.roles.quizzMaster]), async (req: any, res) => {
    try {
        await quizzService.activateQuizz(addModificationAuditInfo(req.query.profile, { id: req.params.id }));
        res.status(200).send(config.responseMessages.Success);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
    }
});

quizzesRouter.get('/:id/scoreboard', Authorize(), async (req: any, res) => {
    try {
        req.query.quizId = req.params.id;
        const result = await quizzScoreBoard.findScoreboard(validatePagination(req.query));
        res.status(200).send(result);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
    }
});

export default quizzesRouter;
