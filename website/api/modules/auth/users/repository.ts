import UsersModel from './mongoose';
import {
  IFindUsersQuery,
  IFindUsersResult,
  IFindUserDetail,
  ICreateUserInput,
  IActivateUser,
  IUpdateUserInput,
  IUser,
  IUpdateUserResetToken,
  IUpdateUserRole,
  IUpdateUserPoints,
} from './interface';
import logger from '../../../core/logger/log4js';

const addQuery = (query: IFindUsersQuery): any => {
  return UsersModel.find({
    $and: [
      query.searchTerm
        ? {
            $or: [
              { email: { $regex: `^${query.searchTerm}`, $options: 'i' } },
              { username: { $regex: `^${query.searchTerm}`, $options: 'i' } },
              { normalizedFullname: { $regex: `^${query.searchTerm}`, $options: 'i' } },
            ],
          }
        : {},
      query.role ? { roles: query.role } : {},
      query.isActive !== undefined ? { isActive: query.isActive } : {},
      query.emailConfirmed !== undefined ? { emailConfirmed: query.emailConfirmed } : {},
      query.pageIndex
        ? { createdAt: query.pageOrientation ? { $lt: query.pageIndex } : { $gt: query.pageIndex } }
        : {},
    ],
  });
};

const findUsers = async (query: IFindUsersQuery): Promise<IFindUsersResult> => {
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
      .select(
        `_id username email profileImgUrl fullName i18n roles createdAt scorePoint rewardPoint`
      )
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

const findUserById = async (userId: string): Promise<IFindUserDetail> => {
  try {
    return (await UsersModel.findOne({ _id: userId })
      .select(
        `_id username email profileImgUrl fullName i18n roles createdAt scorePoint rewardPoint`
      )
      .exec()) as IFindUserDetail;
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const findUserScoreById = async (userId: string): Promise<IFindUserDetail> => {
  try {
    return (await UsersModel.findOne({ _id: userId })
      .select(`rewardPoint email`)
      .exec()) as any;
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const findUserByUsername = async (username: string): Promise<IFindUserDetail> => {
  try {
    return (await UsersModel.findOne({ username: { $regex: `^${username}`, $options: 'i' } })
      .select(
        `_id username email profileImgUrl fullName i18n roles createdAt scorePoint rewardPoint`
      )
      .exec()) as IFindUserDetail;
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const findUserByEmail = async (email: string): Promise<IFindUserDetail> => {
  try {
    return (await UsersModel.findOne({
      email: { $regex: `^${email}`, $options: 'i' },
    }).exec()) as IFindUserDetail;
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const createUser = async (body: ICreateUserInput): Promise<IFindUserDetail> => {
  try {
    const newUser = new UsersModel(body);
    return await newUser.save();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const verifyEmail = async (params: IActivateUser): Promise<void> => {
  try {
    await UsersModel.findOneAndUpdate(
      { _id: params.userId },
      {
        $set: {
          emailConfirmed: true,
          lastModifiedBy: params.lastModifiedBy,
          lastModifiedAt: params.lastModifiedAt,
        },
      },
      { new: true }
    ).exec();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const updateUser = async (body: IUpdateUserInput): Promise<void> => {
  try {
    await UsersModel.findOneAndUpdate({ _id: body._id }, { $set: body }, { new: true }).exec();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const updateUserResetToken = async (body: IUpdateUserResetToken): Promise<void> => {
  try {
    await UsersModel.findOneAndUpdate(
      { _id: body._id },
      {
        $set: {
          resetPasswordToken: body.resetPasswordToken,
          resetPasswordExpires: body.resetPasswordExpires,
          lastModifiedAt: body.lastModifiedAt,
          lastModifiedBy: body.lastModifiedBy,
        },
      },
      { new: true }
    ).exec();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const activateUser = async (params: IActivateUser): Promise<void> => {
  try {
    await UsersModel.findOneAndUpdate(
      { _id: params.userId },
      {
        $set: {
          isActive: true,
          lastModifiedAt: params.lastModifiedAt,
          lastModifiedBy: params.lastModifiedBy,
        },
      },
      { new: true }
    ).exec();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const deactivateUser = async (params: IActivateUser): Promise<void> => {
  try {
    await UsersModel.findOneAndUpdate(
      { _id: params.userId },
      {
        $set: {
          isActive: false,
          lastModifiedAt: params.lastModifiedAt,
          lastModifiedBy: params.lastModifiedBy,
        },
      },
      { new: true }
    ).exec();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const findUserForLogin = async (usernameOrEmail: string, isEmail: boolean): Promise<IUser> => {
  try {
    return (await UsersModel.findOne(
      !isEmail
        ? { username: { $regex: `^${usernameOrEmail}`, $options: 'i' } }
        : { email: { $regex: `^${usernameOrEmail}`, $options: 'i' } }
    ).exec()) as IUser;
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const findUserByResetToken = async (token: string): Promise<IFindUserDetail> => {
  try {
    return (await UsersModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).exec()) as IFindUserDetail;
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const updateUserRoles = async (params: IUpdateUserRole): Promise<void> => {
  try {
    await UsersModel.findOneAndUpdate(
      { _id: params.id },
      {
        $set: {
          lastModifiedAt: params.lastModifiedAt,
          lastModifiedBy: params.lastModifiedBy,
          roles: params.roles,
        },
      }
    ).exec();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const updateUserScore = async (params: IUpdateUserPoints): Promise<void> => {
  try {
    await UsersModel.findOneAndUpdate(
      { _id: params.id },
      {
        $set: {
          lastModifiedAt: params.lastModifiedAt,
          lastModifiedBy: params.lastModifiedBy,
        },
        $inc: {
          scorePoint: params.points,
          rewardPoint: params.rewardPoints,
        },
      }
    ).exec();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const updateUserRewardPoint = async (params: IUpdateUserPoints): Promise<void> => {
  try {
    await UsersModel.findOneAndUpdate(
      { _id: params.id },
      {
        $set: {
          lastModifiedAt: params.lastModifiedAt,
          lastModifiedBy: params.lastModifiedBy,
        },
        $inc: {
          rewardPoint: params.points,
        },
      }
    ).exec();
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

const findUserNameById = async (_id: string): Promise<string> => {
  try {
    const result = await (UsersModel.findOne({ _id }, { _id: 0 })
      .select('username')
      .exec() as any);
    return result.username;
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    throw new Error('Internal Server Error');
  }
};

export default {
  findUsers,
  findUserById,
  findUserByEmail,
  createUser,
  verifyEmail,
  updateUserScore,
  updateUser,
  activateUser,
  deactivateUser,
  findUserForLogin,
  findUserByUsername,
  updateUserResetToken,
  findUserByResetToken,
  updateUserRoles,
  findUserNameById,
  findUserScoreById,
  updateUserRewardPoint,
};
