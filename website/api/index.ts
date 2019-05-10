import * as express from 'express';
import bootstrapAuth from './modules/auth/bootstrap';
import bootstrapQuizzes from './modules/quizzes/bootstrap';
import bootstrapQuizScoreboard from './modules/quizzes/total-scoreboard/bootstrap';
import bootstrapUpload from './modules/upload/bootstrap';
import bootstrapVoucher from './modules/voucher/bootstrap';
const apiRouter = express.Router();

// Bootstrap API
bootstrapAuth(apiRouter);
bootstrapQuizzes(apiRouter);
bootstrapQuizScoreboard(apiRouter);
bootstrapUpload(apiRouter);
bootstrapVoucher(apiRouter);

export default apiRouter;
