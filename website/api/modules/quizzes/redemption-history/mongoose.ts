import * as mongoose from 'mongoose';
import { addAuditSchema } from '../../../core/helpers';
import { IRedemptionHistory } from './interface';

const RedemptionHistorySchema = new mongoose.Schema(addAuditSchema({
    userId: String,
    points: Number,
    reason: String,
    isActive: Boolean,
}));

const RedemptionHistoryModel = mongoose.model<IRedemptionHistory>('RedemptionHistory', RedemptionHistorySchema);

RedemptionHistorySchema.index({ userId: 1 });
RedemptionHistorySchema.index({ reason: 1 });

export { RedemptionHistorySchema };

export default RedemptionHistoryModel;
