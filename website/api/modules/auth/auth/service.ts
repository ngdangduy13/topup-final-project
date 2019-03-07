import * as Joi from 'joi';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import userRepository from '../users/repository';
import { ILoginInput, ITokenData } from './interface';
import { IUser, ICreateUserInput, IFindUserDetail, IUpdateUserResetToken } from '../users/interface';
import config from '../../../../configs';
import { addModificationAuditInfo } from '../../../core/helpers';

const addFullName = (user: ICreateUserInput) => {
  const normalizedFullName = [user.firstName, user.lastName].join(' ').toLocaleLowerCase();

  const fullName = [user.firstName, user.lastName].join(' ');

  return {
    ...user,
    normalizedFullName,
    fullName,
  };
};

const checkEmailExist = async (email: string): Promise<boolean> => {
  if (!email) {
    throw new Error('Bad Request');
  }

  // check if email exist
  const existedUser = await userRepository.findUserByEmail(email);
  if (existedUser) {
    return true;
  } else {
    return false;
  }
};

const getUserDetail = async (email: string): Promise<IFindUserDetail> => {
  if (!email) {
    throw new Error('Bad Request');
  }

  const user = await userRepository.findUserByEmail(email);
  return user;
};

const updateUserToken = async (user: IUpdateUserResetToken): Promise<void> => {
  if (!user) {
    throw new Error('Bad Request');
  }
  await userRepository.updateUserResetToken(user);
};

const createToken = async (user: IUser, isRememberMe: boolean, isMobile = false): Promise<string> => {
  const tokenData: ITokenData = {
    _id: user._id,
    email: user.email,
    profileImgUrl: user.profileImgUrl,
    fullName: user.fullName,
    dob: user.dob,
    phoneNumber: user.phoneNumber,
    i18n: user.i18n,
    permissions: user.permissions ? user.permissions : [],
    roles: user.roles ? user.roles : [],
    username: user.username,
    scorePoint: user.scorePoint,
    rewardPoint: user.rewardPoint,
  };
  const expiresIn = isRememberMe ? config.auth.expiresIn_7days : config.auth.expiresIn_1day;

  return await jwt.sign(tokenData, config.auth.secret, !isMobile ? { expiresIn } : {});
};

const refreshToken = async (token: string): Promise<string> => {
  let oldTokenData: ITokenData = {} as any;
  try {
    oldTokenData = jwt.verify(token, config.auth.secret) as any;
  } catch (error) {
    throw new Error('Invalid token');
  }

  if (oldTokenData && oldTokenData.exp && oldTokenData.exp < Math.round(new Date().getTime() / 1000)) {
    throw new Error('Token expired');
  }

  const user = await userRepository.findUserForLogin(oldTokenData.email, true);
  return await createToken(user, (oldTokenData.exp! - oldTokenData.iat! >= config.auth.expiresIn_7days));
};

const decodeToken = async (token: string): Promise<ITokenData> => {
  let oldTokenData: ITokenData = {} as any;
  try {
    oldTokenData = jwt.verify(token, config.auth.secret) as any;
  } catch (error) {
    throw new Error('Invalid token');
  }

  if (oldTokenData && oldTokenData.exp && oldTokenData.exp < Math.round(new Date().getTime() / 1000)) {
    throw new Error('Token expired');
  }

  return oldTokenData;
};

const loginLocal = async (body: ILoginInput): Promise<string> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    usernameOrEmail: Joi.string().required(),
    password: Joi.string().required(),
    rememberMe: Joi.boolean().required(),
    isMobile: Joi.boolean().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  const isEmail = config.usersModuleConfig.emailRegex.test(body.usernameOrEmail);
  // Check Email and Password
  const existedUser = await userRepository.findUserForLogin(body.usernameOrEmail, isEmail);
  if (!existedUser && isEmail) {
    throw new Error(`Email Or Password Is Incorrect`);
  }
  if (!existedUser && !isEmail) {
    throw new Error(`Username Or Password Is Incorrect`);
  }
  if (!existedUser.emailConfirmed) {
    throw new Error(`Email Doesn't Exist`);
  }
  if (!existedUser.isActive) {
    throw new Error('This Email Is Currently Deactivate. Please Contact Your Admin');
  }
  if (!bcrypt.compareSync(body.password, existedUser.password) && !isEmail) {
    throw new Error(`Username Or Password Is Incorrect`);
  }

  if (!bcrypt.compareSync(body.password, existedUser.password) && isEmail) {
    throw new Error(`Email Or Password Is Incorrect`);
  }

  // if ((!existedUser.roles || existedUser.roles.indexOf(config.roles.admin) === -1)) {
  //   throw new Error('Unauthorized');
  // }

  return await createToken(existedUser, body.rememberMe, body.isMobile);
};

const registerUser = async (body: ICreateUserInput): Promise<string> => {
  // validate body
  const validationRule = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(config.usersModuleConfig.passwordRegex).required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    phoneNumber: Joi.string(),
    roles: Joi.array(),
    username: Joi.string().regex(config.usersModuleConfig.usernameRegex).required(),
    profileImgUrl: Joi.string(),
    isMobile: Joi.boolean().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // check if email exist
  const existedUser = await userRepository.findUserByEmail(body.email);
  if (existedUser) {
    throw new Error('Email has Been Used');
  }

  // check if username exist
  const existedUsername = await userRepository.findUserByUsername(body.username);
  if (existedUsername) {
    throw new Error('Username has Been Used');
  }

  // create new user
  const userWithFullname = addFullName(body);
  const userWithHashPassword = {
    ...userWithFullname,
    fullName: body.fullName,
    isActive: true,
    emailConfirmed: true,
    resetPasswordToken: '',
    resetPasswordExpires: new Date(0),
    scorePoint: 0,
    rewardPoint: 1000,
    password: await bcrypt.hash(userWithFullname.password, userWithFullname.password.length),
  };
  await userRepository.createUser(userWithHashPassword);
  return await loginLocal({ usernameOrEmail: body.username, password: body.password, rememberMe: false, isMobile: body.isMobile });
};

const resetPassword = async (token: string, password: string): Promise<string> => {
  const user = await userRepository.findUserByResetToken(token);
  if (!user) {
    throw new Error('Password reset token is invalid or has expired.');
  }

  const validationRule = {
    password: Joi.string().regex(config.usersModuleConfig.passwordRegex).required(),
  };
  const { error } = Joi.validate({ password }, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  user.password = await bcrypt.hash(password, password.length);
  user.resetPasswordToken = '';
  user.resetPasswordExpires = new Date(0);
  await userRepository.updateUser((addModificationAuditInfo({ email: user.email }, user) as any)._doc);
  return user.email;
};

export default {
  checkEmailExist,
  loginLocal,
  registerUser,
  refreshToken,
  getUserDetail,
  updateUserToken,
  resetPassword,
  decodeToken,
};
