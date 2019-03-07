import * as mongoose from 'mongoose';
import { addAuditSchema } from '../../../../core/helpers';
import { IQuizzScoreBoard } from './interface';

const QuizzScoreBoardSchema = new mongoose.Schema(addAuditSchema({
    quizId: String,
    userId: String,
    points: Number,
    username: String,
    firstSubmittedAt: Date,
    profileImgUrl: String,
}));

const QuizzScoreBoardModel = mongoose.model<IQuizzScoreBoard>('QuizzScoreBoard', QuizzScoreBoardSchema);
QuizzScoreBoardSchema.index({ userId: 1 });
QuizzScoreBoardSchema.index({ firstSubmittedAt: 1 });
export {
    QuizzScoreBoardSchema,
};
export default QuizzScoreBoardModel;
