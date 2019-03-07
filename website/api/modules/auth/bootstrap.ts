import { Router } from 'express';
import usersRouter from './users/router';
import authRouter from './auth/router';
import rolesRouter from './roles/router';
import Authorize from '../../../nextjs/middlewares/authorize';
import config from '../../../configs';

const bootstrapAuth = (router: Router) => {
  router.use('/users', usersRouter);
  router.use('/roles', Authorize([config.roles.admin, config.roles.quizzMaster]), rolesRouter);
  router.use('/auth', authRouter);
};

export default bootstrapAuth;
