import { Router } from 'express';
import voucherRouter from './router';

const bootstrapVoucher = (router: Router) => {
    router.use('/voucher', voucherRouter);
};
export default bootstrapVoucher;
