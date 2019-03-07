import { Router } from 'express';
import quizzScoreboardRouter from './router';

const bootstrapQuizScoreboard = (router: Router) => {
    router.use('/scoreboard', quizzScoreboardRouter);
};
export default bootstrapQuizScoreboard;
