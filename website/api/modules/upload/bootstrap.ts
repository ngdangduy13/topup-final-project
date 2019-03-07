import { Router } from 'express';
import Authorize from '../../../nextjs/middlewares/authorize';
import uploadRouter from './router';

const bootstrapUpload = (router: Router) => {
    router.use('/uploadImage', Authorize(), uploadRouter);
};
export default bootstrapUpload;
