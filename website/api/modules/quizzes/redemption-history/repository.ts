import { ICreateRedemptionHistoryInput, IFindRempHistoryDetail, IFindRempHistoryQuery, IFindRempHistoryResult, ICancelRedeemPoints } from './interface';
import logger from '../../../core/logger/log4js';
import RedemptionHistoryModel from './mongoose';

const addQuery = (query: IFindRempHistoryQuery): any => {
    return RedemptionHistoryModel.find({
        $and: [
            query.userId ? {
                userId: { $regex: `^${query.userId}`, $options: 'i' },
            } : {},
            // query.role ? { roles: query.role } : {},
            { isActive: true },
            query.pageIndex ?
                { createdAt: query.pageOrientation ? { $lt: query.pageIndex } : { $gt: query.pageIndex } }
                : {},
            // query.isActive !== undefined ? { isActive: true } : {},
            // query.emailConfirmed !== undefined ? { emailConfirmed: query.emailConfirmed } : {},
        ],
    });
};

const createRedemptionHistory = async (body: ICreateRedemptionHistoryInput): Promise<IFindRempHistoryDetail> => {
    try {
        const newHistory = new RedemptionHistoryModel(body);
        return await newHistory.save();
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        throw new Error('Internal Server Error');
    }
};

const findRedemptionHistory = async (query: IFindRempHistoryQuery): Promise<IFindRempHistoryResult> => {
    try {
        if (typeof query.pageOrientation === 'string') {
            query.pageOrientation = query.pageOrientation === 'true';
        }
        const totalPromise = addQuery(query)
            .countDocuments()
            .exec();

        const dataPromise = addQuery(query)
            .sort({ createdAt: query.pageOrientation ? -1 : 1 })
            .limit(Number(query.pageSize) + 1)
            .exec();

        const [total, data] = await Promise.all([totalPromise, dataPromise]);
        if (!query.pageOrientation) {
            data.reverse();
        }
        return {
            total,
            data,
        };
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        throw new Error('Internal Server Error');
    }
};

const cancelRedeemPoints = async (params: ICancelRedeemPoints): Promise<IFindRempHistoryDetail> => {
    try {
        return await RedemptionHistoryModel.findOneAndUpdate(
            { _id: params.redemptionId, userId: params.userId },
            {
                $set: {
                    isActive: false,
                    lastModifiedBy: params.lastModifiedBy,
                    lastModifiedAt: params.lastModifiedAt,
                },
            },
            { new: true },
        ).exec() as IFindRempHistoryDetail;
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        throw new Error('Internal Server Error');
    }
};

export default {
    createRedemptionHistory,
    findRedemptionHistory,
    cancelRedeemPoints,
};
