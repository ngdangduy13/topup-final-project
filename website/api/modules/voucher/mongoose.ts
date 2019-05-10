import * as mongoose from 'mongoose';
import { addAuditSchema } from '../../core/helpers';
import { IVoucher } from './interface';
const VoucherSchema = new mongoose.Schema(
  addAuditSchema({
    coverUrl: String,
    name: String,
    description: String,
    pointForExchange: Number,
    code: String,
  })
);

const VoucherModel = mongoose.model<IVoucher>('Voucher', VoucherSchema);
VoucherSchema.index({ name: 1 });

export { VoucherSchema };
export default VoucherModel;
