import * as express from 'express';
import usersService from './service';
import { addCreationAuditInfo, addModificationAuditInfo, validatePagination } from '../../../core/helpers';
import logger from '../../../core/logger/log4js';
import config from '../../../../configs';
import Authorize from '../../../../nextjs/middlewares/authorize';

const usersRouter = express.Router();

usersRouter.get('/', Authorize([config.roles.admin]), async (req: any, res) => {
  try {
    const results = await usersService.findUsers(validatePagination(req.query));
    res.status(200).send(results);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});

usersRouter.get('/:id', Authorize(), async (req: any, res) => {
  try {
    const result = await usersService.findUserById(req.params.id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});

usersRouter.post('/', Authorize([config.roles.admin]), async (req: any, res) => {
  try {
    const newUser = await usersService.createUser(addCreationAuditInfo(req, req.body));
    res.status(200).send(newUser);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});

usersRouter.get('/verifyEmail/:userId', async (req: any, res) => {
  try {
    await usersService.verifyEmail(addModificationAuditInfo(req, req.params));
    res.status(200).redirect('/auth/login');
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});

usersRouter.put('/:id', Authorize(), async (req: any, res) => {
  try {
    if (req.body) {
      req.body._id = req.params.id;
    }
    const newUser = await usersService.updateUser(addModificationAuditInfo(req.query.profile, req.body));
    res.status(200).send(newUser);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});

usersRouter.put('/activateUser/:userId', Authorize([config.roles.admin]), async (req: any, res) => {
  try {
    await usersService.activateUser(addModificationAuditInfo(req.query.profile, req.params));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});

usersRouter.put('/deactivateUser/:userId', Authorize([config.roles.admin]), async (req: any, res) => {
  try {
    await usersService.deactivateUser(addModificationAuditInfo(req.query.profile, req.params));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});

usersRouter.post('/:id/updateroles', Authorize([config.roles.admin]), async (req: any, res) => {
  try {
    req.body.id = req.params.id;
    await usersService.updateUserRoles(addModificationAuditInfo(req.query.profile, req.body));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});

usersRouter.get('/:id/redeempoints', Authorize([config.roles.admin, config.roles.quizzMaster]), async (req: any, res) => {
  try {
    req.query.userId = req.params.id;
    const result = await usersService.getRedeemPoints(req.query);
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});

usersRouter.post('/:id/redeempoints', Authorize([config.roles.admin, config.roles.quizzMaster]), async (req: any, res) => {
  try {
    req.body.userId = req.params.id;
    const result = await usersService.redeemPoints(addCreationAuditInfo(req.query.profile, req.body));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});

usersRouter.post('/:id/cancelredeempoints', Authorize([config.roles.admin, config.roles.quizzMaster]), async (req: any, res) => {
  try {
    req.body.userId = req.params.id;
    await usersService.cancelRedeemPoints(addModificationAuditInfo(req.query.profile, req.body));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});

export default usersRouter;
