import * as express from 'express';
import logger from '../../core/logger/log4js';
import voucherService from './service';
import { validatePagination, addCreationAuditInfo } from '../../core/helpers';
import config from '../../../configs';
import Authorize from '../../../nextjs/middlewares/authorize';

const voucherRouter = express.Router();

voucherRouter.post('/', Authorize([config.roles.admin]), async (req: any, res) => {
  try {
    const results = await voucherService.createVoucher(
      addCreationAuditInfo(req.query.profile, req.body)
    );
    res.status(200).send(results);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res
      .status(error.status || 500)
      .send({ message: error.message } || config.responseMessages.Internal);
  }
});

voucherRouter.get('/', Authorize(), async (req: any, res) => {
  try {
    const results = await voucherService.findVoucher(validatePagination(req.query));
    res.status(200).send(results);
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res
      .status(error.status || 500)
      .send({ message: error.message } || config.responseMessages.Internal);
  }
});

export default voucherRouter;
