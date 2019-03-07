import { Router } from 'express';
import quizzesRouter from './router';

const bootstrapQuizzes = (router: Router) => {
    router.use('/quizzes', quizzesRouter);
};
export default bootstrapQuizzes;
