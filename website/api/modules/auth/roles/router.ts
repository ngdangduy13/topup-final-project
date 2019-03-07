import * as express from 'express';
import rolesService from './service';
import logger from '../../../core/logger/log4js';
import { validatePagination, addCreationAuditInfo, addModificationAuditInfo } from '../../../core/helpers';

const rolesRouter = express.Router();

rolesRouter.get('/getAllRoles', async (_req: any, res) => {
  try {
    const result = await rolesService.getAllRoles();
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || 'Internal Server Error');
  }
});

rolesRouter.get('/findRoles', async (req: any, res) => {
  try {
    const result = await rolesService.findRoles(validatePagination(req.query));
    res.status(200).send(result);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || 'Internal Server Error');
  }
});

rolesRouter.post('/createRole', async (req: any, res) => {
  try {
    const newRole = await rolesService.createRole(addCreationAuditInfo(req, req.body));
    res.status(200).send(newRole);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || 'Internal Server Error');
  }
});

rolesRouter.put('/updateRole', async (req: any, res) => {
  try {
    await rolesService.updateRole(addModificationAuditInfo(req.query.profile, req.body));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || 'Internal Server Error');
  }
});

rolesRouter.put('/activateRole/:roleId', async (req: any, res) => {
  try {
    await rolesService.activateRole(addModificationAuditInfo(req.query.profile, req.params));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || 'Internal Server Error');
  }
});

rolesRouter.put('/deactivateRole/:roleId', async (req: any, res) => {
  try {
    await rolesService.deactivateRole(addModificationAuditInfo(req.query.profile, req.params));
    res.status(200).end();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send(error.message || 'Internal Server Error');
  }
});

export default rolesRouter;
