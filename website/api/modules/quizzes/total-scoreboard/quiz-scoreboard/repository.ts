import { IFindQuizzScoreBoardQuery, IFindQuizzScoreBoardResult, ICreateQuizzScoreBoardInput, IFindQuizzScoreBoardDetail, IUpdateQuizzScoreBoardInput, ICheckUserScoreboardParms } from './interface';
import QuizzScoreBoardModel from './mongoose';
import logger from '../../../../core/logger/log4js';

const addQuery = (query: IFindQuizzScoreBoardQuery): any => {
    return QuizzScoreBoardModel.find({
        $and: [
            query.quizId ? { quizId: query.quizId } : {},
            // query.userId ? { userId: query.userId } : {},
            // query.pageIndex ?
            //     { createdAt: query.pageOrientation ? { $lt: query.pageIndex } : { $gt: query.pageIndex } }
            //     : {},
            // query.role ? { roles: query.role } : {},
            // query.isActive !== undefined ? { isActive: query.isActive } : {},
            // query.emailConfirmed !== undefined ? { emailConfirmed: query.emailConfirmed } : {},
        ],
    });
};

const findScoreboard = async (query: IFindQuizzScoreBoardQuery): Promise<IFindQuizzScoreBoardResult> => {
    try {
        // if (typeof query.pageOrientation === 'string') {
        //     query.pageOrientation = query.pageOrientation === 'true';
        // }
        const dataPromise = await addQuery(query)
            .sort({ points:  -1  })
            .select('username points quizId userId firstSubmittedAt profileImgUrl')
            .limit(Number(query.pageSize) + 1)
            .exec();

        // if (!query.pageOrientation) {
        //     dataPromise.reverse();
        // }
        return {
            total: 0,
            data: dataPromise,
        };
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        throw new Error('Internal Server Error');
    }
};

const createScoreboard = async (body: ICreateQuizzScoreBoardInput): Promise<IFindQuizzScoreBoardDetail> => {
    try {
        const newScoreboard = new QuizzScoreBoardModel(body);
        return await newScoreboard.save();
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        throw new Error('Internal Server Error');
    }
};

const isUserScoreboardExist = async (body: ICheckUserScoreboardParms): Promise<string> => {
    try {
        return await QuizzScoreBoardModel.findOne({ userId: body.userId, quizId: body.quizId }).select('_id').exec() as any;
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        throw new Error('Internal Server Error');
    }
};

const updateScoreboard = async (body: IUpdateQuizzScoreBoardInput): Promise<void> => {
    try {
        await QuizzScoreBoardModel.findOneAndUpdate({ userId: body.userId, quizId: body.quizId }, { $inc: { points: body.points } });
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        throw new Error('Internal Server Error');
    }
};

export default {
    findScoreboard,
    createScoreboard,
    isUserScoreboardExist,
    updateScoreboard,
};
