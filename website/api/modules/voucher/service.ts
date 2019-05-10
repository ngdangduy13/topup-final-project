import { IFindVoucher, ICreateVoucher, IFindVoucherQuery, IFindVoucherResult } from './interface';
import * as Joi from 'joi';
import repository from './repository';

const findVoucher = async (query: IFindVoucherQuery): Promise<IFindVoucherResult> => {
  return await repository.findVoucher(query);
};

const createVoucher = async (body: ICreateVoucher): Promise<IFindVoucher> => {
  const validationRule = Joi.object().keys({
    coverUrl: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    pointForExchange: Joi.number().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });

  if (error) {
    throw new Error(error.details[0].message);
  }

  const checkExistTitle = await repository.findVoucherByTitle(body.name);
  if (checkExistTitle) {
    throw new Error('Name already exists');
  }

  return await repository.createVoucher(body);
};
export default {
  createVoucher,
  findVoucher,
};
