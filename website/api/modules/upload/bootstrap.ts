import { Router } from 'express';
// import Authorize from '../../../nextjs/middlewares/authorize';
import uploadRouter from './router';

const bootstrapUpload = (router: Router) => {
    router.use('/uploadImage', uploadRouter);
};
export default bootstrapUpload;
