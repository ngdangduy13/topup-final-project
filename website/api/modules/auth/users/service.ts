import * as Joi from 'joi';
import * as bcrypt from 'bcryptjs';
import usersRepository from './repository';
import { IFindUsersQuery, IFindUsersResult, IFindUserDetail, ICreateUserInput, IActivateUser, IUpdateUserInput, IUpdateUserRole } from './interface';
import config from '../../../../configs';
import redempHistoryRepository from '../../quizzes/redemption-history/repository';
import { ICreateRedemptionHistoryInput, IFindRempHistoryDetail, ICancelRedeemPoints, IFindRempHistoryQuery, IFindRempHistoryResult } from '../../quizzes/redemption-history/interface';
import { addModificationAuditInfo, validatePagination } from '../../../core/helpers';

const addFullName = (user: ICreateUserInput) => {
  const normalizedFullName = [user.firstName, user.lastName]
    .join(' ')
    .toLocaleLowerCase();

  const fullName = [user.firstName, user.lastName].join(' ');

  return {
    ...user,
    normalizedFullName,
    fullName,
  };
};

const findUsers = async (query: IFindUsersQuery): Promise<IFindUsersResult> => {
  return await usersRepository.findUsers(query);
};

const findUserById = async (userId: string): Promise<IFindUserDetail> => {
  if (!userId) {
    throw new Error('User ID Cant Empty');
  }

  const existedUser = await usersRepository.findUserById(userId);
  if (!existedUser) {
    throw new Error('User Not Found');
  } else {
    return existedUser;
  }
};

const createUser = async (body: ICreateUserInput): Promise<IFindUserDetail> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(config.usersModuleConfig.passwordRegex).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If Email Exist
  const existedUser = await usersRepository.findUserByEmail(body.email);
  if (existedUser) {
    throw new Error('Email Has Been Used');
  }

  // Add Fullname, hash Password
  const userWithFullname = addFullName(body);
  const userWithHashPassword = {
    ...userWithFullname,
    password: await bcrypt.hash(userWithFullname.password, userWithFullname.password.length),
  };

  // Save to db
  return await usersRepository.createUser(userWithHashPassword);
};

const verifyEmail = async (params: IActivateUser): Promise<void> => {
  // Check UserId
  if (!params.userId) {
    throw new Error('User ID Is Empty');
  }

  // Check if User exist
  const existedUser = await usersRepository.findUserById(params.userId);
  if (!existedUser) {
    throw new Error('User Doesnt Exist');
  }

  // Verify Email
  await usersRepository.verifyEmail(params);
};

const updateUser = async (body: IUpdateUserInput): Promise<void> => {
  // Validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    // password: Joi.string(),
    profileImgUrl: Joi.string(),
    // firstName: Joi.string(),
    // lastName: Joi.string(),
    // dob: Joi.date(),
    // phoneNumber: Joi.string(),
    i18n: Joi.string(),
    // permissions: Joi.array(),
    // roles: Joi.array(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If UserId Exist
  const existedUser = await usersRepository.findUserById(body._id);
  if (!existedUser) {
    throw new Error('User Doesnt Exist');
  }

  // Update
  return await usersRepository.updateUser({
    ...body,
    // fullName: [body.firstName ? body.firstName : existedUser.firstName, body.lastName ? body.lastName : existedUser.lastName].join(' '),
    // normalizedFullName: [body.firstName ? body.firstName : existedUser.firstName, body.lastName ? body.lastName : existedUser.lastName].join(' ').toLocaleLowerCase(),
  });
};

const activateUser = async (params: IActivateUser): Promise<void> => {
  // Check UserId
  if (!params.userId) {
    throw new Error('User ID Is Empty');
  }

  // Check if User exist
  const existedUser = await usersRepository.findUserById(params.userId);
  if (!existedUser) {
    throw new Error('User Doesnt Exist');
  }

  // Activate
  await usersRepository.activateUser(params);
};

/** deactive user */
const deactivateUser = async (params: IActivateUser): Promise<void> => {
  // Check UserId
  if (!params.userId) {
    throw new Error('User ID Is Empty');
  }

  // Check if User exist
  const existedUser = await usersRepository.findUserById(params.userId);
  if (!existedUser) {
    throw new Error('User Doesnt Exist');
  }

  await usersRepository.deactivateUser(params);
};

const updateUserRoles = async (params: IUpdateUserRole): Promise<void> => {
  if (!params.id) {
    throw new Error('User ID Is Empty');
  }
  await usersRepository.updateUserRoles(params);
};

const redeemPoints = async (params: ICreateRedemptionHistoryInput): Promise<IFindRempHistoryDetail> => {
  if (!params.userId) {
    throw new Error('User ID Is Empty');
  }

  if (!params.points || typeof params.points !== 'number' || params.points === 0) {
    throw new Error('Please Input Valid Points');
  }

  if (!params.reason || params.reason.trim() === '') {
    throw new Error('Please Input Valid Reason');
  }
  const userScore = await usersRepository.findUserScoreById(params.userId);
  if (!userScore) {
    throw new Error('User not found');
  }
  if (userScore.rewardPoint < params.points) {
    throw new Error('Not Enough Point');
  }
  await usersRepository.updateUserRewardPoint((addModificationAuditInfo({ email: userScore.email }, { id: params.userId, points: -(Math.abs(params.points)) })));
  params.isActive = true;
  return await redempHistoryRepository.createRedemptionHistory(params);
};

const cancelRedeemPoints = async (params: ICancelRedeemPoints): Promise<void> => {
  if (!params.redemptionId) {
    throw new Error('Redemption History Not Found');
  }
  if (!params.userId) {
    throw new Error('User ID Is Empty');
  }
  const userCancelRedeem = await usersRepository.findUserScoreById(params.userId);
  const deletedRedem = await redempHistoryRepository.cancelRedeemPoints(params);
  await usersRepository.updateUserRewardPoint((addModificationAuditInfo({ email: userCancelRedeem.email }, { id: params.userId, points: deletedRedem.points })));
};

const getRedeemPoints = async (params: IFindRempHistoryQuery): Promise<IFindRempHistoryResult> => {
  if (!params.userId) {
    throw new Error('User ID Is Empty');
  }
  return await redempHistoryRepository.findRedemptionHistory(validatePagination(params));
};

export default {
  findUsers,
  findUserById,
  createUser,
  verifyEmail,
  updateUser,
  activateUser,
  updateUserRoles,
  deactivateUser,
  redeemPoints,
  cancelRedeemPoints,
  getRedeemPoints,
};
