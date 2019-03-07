import { IFindTotalScoreBoardQuery, IFindTotalScoreBoardResult, ICreateTotalScoreBoardInput, IFindTotalScoreBoardDetail, IUpdateTotalScoreBoardInput } from './interface';
import TotalScoreBoardModel from './mongoose';
import logger from '../../../core/logger/log4js';

const addQuery = (query: IFindTotalScoreBoardQuery): any => {
    return TotalScoreBoardModel.find({
        $and: [
            query.userId ? { userId: query.userId } : {},
            // query.role ? { roles: query.role } : {},
            // query.isActive !== undefined ? { isActive: query.isActive } : {},
            // query.emailConfirmed !== undefined ? { emailConfirmed: query.emailConfirmed } : {},
            query.quizId ? { quizId: query.quizId } : {},
        ],
    });
};

const findScoreboard = async (query: IFindTotalScoreBoardQuery): Promise<IFindTotalScoreBoardResult> => {
    try {
        if (typeof query.pageOrientation === 'string') {
            query.pageOrientation = query.pageOrientation === 'true';
        }
        const totalPromise = addQuery(query)
            .countDocuments()
            .exec();

        const dataPromise = await addQuery(query)
            .sort({ points: -1 })
            .select('username points userId profileImgUrl quizId')
            .limit(Number(query.pageSize) + 1)
            .exec();

        const [total, data] = await Promise.all([totalPromise, dataPromise]);
        return {
            total,
            data,
        };
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        throw new Error('Internal Server Error');
    }
};

const createScoreboard = async (body: ICreateTotalScoreBoardInput): Promise<IFindTotalScoreBoardDetail> => {
    try {
        const newScoreboard = new TotalScoreBoardModel(body);
        return await newScoreboard.save();
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        throw new Error('Internal Server Error');
    }
};

const updateScoreboard = async (body: IUpdateTotalScoreBoardInput): Promise<void> => {
    try {
        await TotalScoreBoardModel.findOneAndUpdate({ userId: body.userId }, { $inc: { points: body.points }, $push: { quizId: body.quizId } });
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        throw new Error('Internal Server Error');
    }
};

export default {
    findScoreboard,
    createScoreboard,
    updateScoreboard,
};
