import { Document } from 'mongoose';
import { IsAuditable, HasActive, PageableQuery, SortableQuery, PageableResult, HasCreationAuditInfo, HasModificationAuditInfo } from '../../../core/interfaces';

export interface IUser extends Document, IsAuditable, HasActive {
  email: string;
  password: string;
  profileImgUrl: string;
  firstName: string;
  username: string;
  lastName: string;
  fullName: string;
  normalizedFullName: string;
  dob: Date;
  phoneNumber: string;
  i18n: string;
  permissions: string[];
  roles: string[];

  externalLogin: {
    google: {
      id: string;
      email: string;
    };
    facebook: {
      id: string;
      email: string;
    };
  };

  failLoginTryCount: number;
  emailConfirmed: boolean;
  lastLoginTime: Date;

  scorePoint: number;
  rewardPoint: number;

  resetPasswordToken: string;
  resetPasswordExpires: Date;
}

export interface IFindUsersQuery extends PageableQuery, SortableQuery {
  searchTerm?: string;
  role?: string;
  isActive?: boolean;
  emailConfirmed?: boolean;
}

export interface IFindUserDetail {
  _id: string;
  email: string;
  profileImgUrl: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  dob?: Date;
  password?: string;
  phoneNumber?: string;
  i18n: string;
  permissions?: string[];
  roles: string[];
  isActive?: boolean;
  emailConfirmed?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  scorePoint: number;
  rewardPoint: number;
  createdAt: Date;

  externalLogin?: {
    google?: {
      id: string;
      email: string;
    };
    facebook?: {
      id: string;
      email: string;
    };
  };
}

export interface IUpdateUserResetToken extends HasModificationAuditInfo {
  _id: string;
  email: string;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
}

export interface IUpdateUserPoints extends HasModificationAuditInfo {
  id: string;
  points: number;
}

export interface IUpdateUserRole extends HasModificationAuditInfo {
  id: string;
  roles: [string];
}

export interface IFindUsersResult extends PageableResult<IFindUserDetail> { }

export interface ICreateUserInput extends HasCreationAuditInfo, HasActive {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roles: string[];
  fullName: string;
  profileImgUrl: string;
  isMobile: boolean;
}

export interface IActivateUser extends HasModificationAuditInfo {
  userId: string;
}

export interface IUpdateUserInput extends HasModificationAuditInfo {
  _id: string;
  // password?: string;
  profileImgUrl?: string;
  // firstName?: string;
  // lastName?: string;
  // dob?: Date;
  // phoneNumber?: string;
  i18n?: string;
  // permissions?: string[];
  // roles?: string[];
  fullName?: string;
  // normalizedFullName?: string;
  // scorePoint?: number;
  // rewardPoint?: number;

  externalLogin?: {
    google?: {
      id: string;
      email: string;
    };
    facebook?: {
      id: string;
      email: string;
    };
  };
}
