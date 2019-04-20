import { IFindUsersResult, IFindUserDetail } from '../../../../../api/modules/auth/users/interface';
import { UiAppState } from '../../../../../client/common/interface/uiAppState';
import {
  IFindRempHistoryResult,
  IFindRempHistoryDetail,
} from '../../../../../api/modules/quizzes/redemption-history/interface';

export interface UserPageState extends UiAppState {
  listUser: IFindUsersResult;

  currentUser: IFindUserDetail | {};
  errorMessage: string;
  selectedRoleFilter: string;
  searchTerm: string;
  isUserProfileOpen: boolean;
  listRole: string[];

  redemptionHistory: IFindRempHistoryResult;
  inputScorePoint: string;
  inputReason: string;

  userListPageIndex: string;
  userListPageOrientation: boolean;
  redemptionHistoryPageIndex: string;
  redemptionHistoryPageOrientation: boolean;
  pageSize: number;
  sortBy: string;

  isUserListNextDisabled: boolean;
  isUserListPrevDisabled: boolean;
  isRedemptionHistoryNextDisabled: boolean;
  isRedemptionHistoryPrevDisabled: boolean;

  userListFirstPage: boolean;
  redemptionHistoryFirstPage: boolean;
}

export interface IFetchDataSuccessPayload {
  data: IFindUserDetail[];
  total: number;
}

export interface IFetchRedemHistorySuccessPayload {
  data: IFindRempHistoryDetail[];
  total: number;
}

export interface IErrorPayload {
  errorMessage: string;
}

export interface IUpdateUserRolePayload {
  id: string;
  roles: string[];
}

export interface ICreateRedemptionHistoryInput {
  userId: string;
  points: number;
  reason: string;
}

export interface IDeleteRedemptionHistoryInput {
  redemptionId: string;
  userId: string;
}

export interface ICreateUsersInput {
  username: string;
  fullname?: string;
  email: string;
  password: string;
  roles: string[];
}
