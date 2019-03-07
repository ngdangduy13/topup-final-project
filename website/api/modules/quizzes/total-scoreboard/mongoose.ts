import * as mongoose from 'mongoose';
import { addAuditSchema } from '../../../core/helpers';
import { ITotalScoreBoard } from './interface';

const TotalScoreBoardSchema = new mongoose.Schema(addAuditSchema({
    userId: String,
    points: Number,
    username: String,
    profileImgUrl: String,
    quizId: Array,
}));

const TotalScoreBoardModel = mongoose.model<ITotalScoreBoard>('TotalScoreBoard', TotalScoreBoardSchema);
TotalScoreBoardSchema.index({ userId: 1 });
TotalScoreBoardSchema.index({ points: 1 });
export {
    TotalScoreBoardSchema,
};
export default TotalScoreBoardModel;
