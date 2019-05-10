import {
  IFindQuizzQuery,
  IFindQuizzResult,
  ICreateQuizzInput,
  IFindQuizzDetail,
  IDeactivateQuizz,
  IUpdateQuizzInput,
  IActivateQuizz,
} from './interface';
import QuizzModel from './mongoose';
import logger from '../../core/logger/log4js';

const addQuery = (query: IFindQuizzQuery): any => {
  return QuizzModel.find({
    $and: [
      query.searchTerm
        ? {
            title: { $regex: `${query.searchTerm}`, $options: 'i' },
          }
        : {},
      query.pageIndex
        ? { createdAt: query.pageOrientation ? { $lt: query.pageIndex } : { $gt: query.pageIndex } }
        : {},
      query.state ? { state: { $regex: `${query.state}`, $options: 'i' } } : {},
      // query.uuid && query.major && query.minor ? {
      //     'beacon.isActive': typeof query.isActive === 'string' ? query.isActive === 'true' : query.isActive,
      //     'beacon.uuid': { $regex: `${query.uuid}`, $options: 'i' },
      //     'beacon.major': { $eq: parseInt(query.major, 10) || query.major },
      //     'beacon.minor': { $eq: parseInt(query.minor, 10) || query.minor },
      // } : {},
      // query.role ? { roles: query.role } : {},
      // query.isActive !== undefined ? { isActive: query.isActive } : {},
      // query.emailConfirmed !== undefined ? { emailConfirmed: query.emailConfirmed } : {},
    ],
  });
};

const findQuizzes = async (query: IFindQuizzQuery): Promise<IFindQuizzResult> => {
  try {
    if (typeof query.pageOrientation === 'string') {
      query.pageOrientation = query.pageOrientation === 'true';
    }
    console.log(query);
    const totalPromise = addQuery(query)
      .countDocuments()
      .exec();

    const dataPromise = addQuery(query)
      .sort({ createdAt: query.pageOrientation ? -1 : 1 })
      .sort('_id')
      .select('_id coverImageUrl title createdAt questionCount state')
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

const createQuizz = async (body: ICreateQuizzInput): Promise<IFindQuizzDetail> => {
  try {
    body.questionCount = Object.keys(body.questions).length;
    const newQuizz = new QuizzModel(body);
    return await newQuizz.save();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const deactivateQuizz = async (params: IDeactivateQuizz): Promise<void> => {
  try {
    const result = await QuizzModel.findOneAndUpdate(
      { _id: params.id },
      {
        $set: {
          state: 'REMOVED',
          lastModifiedAt: params.lastModifiedAt,
          lastModifiedBy: params.lastModifiedBy,
        },
      },
      { new: true }
    ).exec();
    if (!result) {
      throw new Error('Deactivate Quiz Failed');
    }
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const updateQuizz = async (body: IUpdateQuizzInput): Promise<void> => {
  try {
    body.questionCount = Object.keys(body.questions).length;
    await QuizzModel.findOneAndUpdate({ _id: body._id }, { $set: body }, { new: true }).exec();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const findQuizzByTitle = async (title: string): Promise<IFindQuizzDetail> => {
  try {
    return (await QuizzModel.findOne({ title: { $regex: `^${title}`, $options: 'i' } })
      .select('_id')
      .exec()) as IFindQuizzDetail;
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const findQuizzBydId = async (id: string): Promise<IFindQuizzDetail> => {
  try {
    return (await QuizzModel.findOne({ _id: id }).exec()) as IFindQuizzDetail;
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};
const activateQuizz = async (params: IActivateQuizz): Promise<void> => {
  try {
    const result = await QuizzModel.findOneAndUpdate(
      { _id: params.id },
      {
        $set: {
          state: 'DRAFT',
          lastModifiedAt: params.lastModifiedAt,
          lastModifiedBy: params.lastModifiedBy,
        },
      },
      { new: true }
    ).exec();
    if (!result) {
      throw new Error('Activate Quiz Failed');
    }
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

export default {
  findQuizzes,
  createQuizz,
  deactivateQuizz,
  findQuizzByTitle,
  updateQuizz,
  findQuizzBydId,
  activateQuizz,
};
