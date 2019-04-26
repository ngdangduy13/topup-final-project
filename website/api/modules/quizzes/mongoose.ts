import * as mongoose from 'mongoose';
import { addAuditSchema } from '../../core/helpers';
import { IQuizz } from './interface';
const QuizzSchema = new mongoose.Schema(
  addAuditSchema({
    coverImageUrl: String,
    title: String,
    description: String,
    state: String,
    questions: [
      {
        id: Number,
        coverType: String,
        coverUrl: String,
        description: String,
        answers: [
          {
            id: Number,
            description: String,
            isCorrect: Boolean,
          },
        ],
      },
    ],
    questionCount: Number,
  })
);

const QuizzModel = mongoose.model<IQuizz>('Quizz', QuizzSchema);
QuizzSchema.index({ title: 1 });

export { QuizzSchema };
export default QuizzModel;
