import VoucherModel from './mongoose';
import logger from '../../core/logger/log4js';
import { IFindVoucher, IFindVoucherQuery, IFindVoucherResult } from './interface';
const addQuery = (query: IFindVoucherQuery): any => {
  return VoucherModel.find({
    $and: [
      query.searchTerm
        ? {
            name: { $regex: `${query.searchTerm}`, $options: 'i' },
          }
        : {},
      query.pageIndex
        ? { createdAt: query.pageOrientation ? { $lt: query.pageIndex } : { $gt: query.pageIndex } }
        : {},
    ],
  });
};

const findVoucher = async (query: IFindVoucherQuery): Promise<IFindVoucherResult> => {
  try {
    if (typeof query.pageOrientation === 'string') {
      query.pageOrientation = query.pageOrientation === 'true';
    }
    const totalPromise = addQuery(query)
      .countDocuments()
      .exec();

    const dataPromise = addQuery(query)
      .sort({ createdAt: query.pageOrientation ? -1 : 1 })
      .sort('_id')
      //   .select('_id name title createdAt questionCount state')
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

const createVoucher = async (body: IFindVoucher): Promise<IFindVoucher> => {
  try {
    body.code = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 5)
      .toLocaleUpperCase();
    const newVoucher = new VoucherModel(body);
    return await newVoucher.save();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const findVoucherByTitle = async (title: string): Promise<IFindVoucher> => {
  try {
    return (await VoucherModel.findOne({ name: { $regex: `^${title}`, $options: 'i' } })
      .select('_id')
      .exec()) as IFindVoucher;
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

export default {
  createVoucher,
  findVoucherByTitle,
  findVoucher,
};
