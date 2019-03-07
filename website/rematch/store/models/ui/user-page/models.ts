import { ModelConfig, createModel } from '@rematch/core';
import {
    UserPageState,
    IFetchDataSuccessPayload,
    IErrorPayload,
    IUpdateUserRolePayload,
    ICreateRedemptionHistoryInput,
    IFetchRedemHistorySuccessPayload,
    IDeleteRedemptionHistoryInput,
} from './state';
import { ServiceProxy } from '../../../../../client/service-proxies/service-proxies';
import { message } from 'antd';
import { IFindUserDetail } from '../../../../../api/modules/auth/users/interface';

const initialState: UserPageState = {
    currentUser: {},
    listUser: { data: [], total: 0 },
    errorMessage: '',
    isBusy: false,
    pageSize: 10,
    sortBy: '',
    selectedRoleFilter: 'all',
    searchTerm: '',
    isUserProfileOpen: false,
    redemptionHistory: { data: [], total: 0 },
    inputReason: '',
    inputScorePoint: '',
    listRole: [],

    userListPageIndex: '',
    userListPageOrientation: true,
    redemptionHistoryPageIndex: '',
    redemptionHistoryPageOrientation: true,

    isUserListNextDisabled: false,
    isUserListPrevDisabled: true,
    isRedemptionHistoryNextDisabled: false,
    isRedemptionHistoryPrevDisabled: true,

    userListFirstPage: true,
    redemptionHistoryFirstPage: true,
};

const usersPageModels: ModelConfig<UserPageState> = createModel({
    state: initialState,
    reducers: {
        onLoading: (state: UserPageState): UserPageState => {
            return {
                ...state,
                isBusy: true,
            };
        },
        fetchDataSuccess: (
            state: UserPageState,
            payload: IFetchDataSuccessPayload,
        ): UserPageState => {
            return {
                ...state,
                isBusy: false,
                listUser: payload,
            };
        },
        onError: (
            state: UserPageState,
            payload: IErrorPayload,
        ): UserPageState => {
            return {
                ...state,
                isBusy: false,
                errorMessage: payload.errorMessage,
            };
        },
        setSearchTerm: (
            state: UserPageState,
            payload: string,
        ): UserPageState => {
            return {
                ...state,
                searchTerm: payload,
            };
        },
        setSelectedRoleFilter: (
            state: UserPageState,
            payload: string,
        ): UserPageState => {
            return {
                ...state,
                selectedRoleFilter: payload,
            };
        },
        switchUserProfileVisibility: (
            state: UserPageState,
            payload: boolean,
        ): UserPageState => {
            return {
                ...state,
                isUserProfileOpen: !payload,
            };
        },
        fetchUserDetail: (
            state: UserPageState,
            payload: IFindUserDetail,
        ): UserPageState => {
            return {
                ...state,
                currentUser: payload,
            };
        },
        updateUserSuccess: (
            state: UserPageState,
            _payload: any,
        ): UserPageState => {
            return {
                ...state,
                errorMessage: '',
                isBusy: false,
            };
        },
        setSelectedRole: (
            state: UserPageState,
            payload: string[],
        ): UserPageState => {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    roles: payload,
                },
            };
        },
        getRedemptionHistorySuccess: (
            state: UserPageState,
            payload: IFetchRedemHistorySuccessPayload,
        ): UserPageState => {
            return {
                ...state,
                isBusy: false,
                redemptionHistory: payload,
            };
        },
        onChangeScorePointReducer: (
            state: UserPageState,
            payload: any,
        ): UserPageState => {
            return {
                ...state,
                ...payload,
            };
        },
        onChangeReasonReducer: (
            state: UserPageState,
            payload: any,
        ): UserPageState => {
            return {
                ...state,
                ...payload,
            };
        },
        setPageIndex: (
            state: UserPageState,
            payload: any,
        ): UserPageState => {
            return {
                ...state,
                ...payload,
            };
        },
        setPageOrientation: (
            state: UserPageState,
            payload: any,
        ): UserPageState => {
            return {
                ...state,
                ...payload,
            };
        },
        setOrientationButtonVisibility: (
            state: UserPageState,
            payload: any,
        ): UserPageState => {
            return {
                ...state,
                ...payload,
            };
        },
        setFirstPageCheck: (
            state: UserPageState,
            payload: any,
        ): UserPageState => {
            return {
                ...state,
                ...payload,
            };
        },
    },
    effects: {
        async fetchUserListEffect(
            _payload: any,
            _rootState: any,
        ): Promise<void> {
            try {
                this.onLoading();
                const service = new ServiceProxy();
                const result = await service
                    .findUsers('',
                        _rootState.usersPageModels.searchTerm,
                        _rootState.usersPageModels.selectedRoleFilter === 'all' ? '' :
                            _rootState.usersPageModels.selectedRoleFilter,
                        _rootState.usersPageModels.userListPageIndex,
                        _rootState.usersPageModels.pageSize, 'createdAt',
                        _rootState.usersPageModels.userListPageOrientation);
                if (_rootState.usersPageModels.userListPageOrientation) {
                    this.setOrientationButtonVisibility({
                        isUserListNextDisabled: (result && (result as any).data && (result as any).data.length < 11),
                    });

                    this.setOrientationButtonVisibility({
                        isUserListPrevDisabled: _rootState.usersPageModels.userListFirstPage,
                    });
                } else {
                    this.setOrientationButtonVisibility({
                        isUserListPrevDisabled: (result && (result as any).data && (result as any).data.length < 11),
                    });
                    this.setOrientationButtonVisibility({
                        isUserListNextDisabled: false,
                    });
                }
                if (result && (result as any).data && (result as any).data.length > 10) {
                    (result as any).data.splice(_rootState.usersPageModels.userListPageOrientation ? 10 : 0, 1);
                }
                this.fetchDataSuccess(result);
            } catch (error) {
                this.onError(error.message);
                message.error(error.message, 3);
            }
        },

        async searchChangeEffect(
            _payload: any,
            _rootState: any,
        ): Promise<void> {
            try {
                this.onLoading();
                // this.setSearchTerm(_payload.searchTerm);
                // this.setSelectedRoleFilter(_payload.role);
                this.setFirstPageCheck({ userListFirstPage: true });
                this.setPageOrientation({
                    userListPageOrientation: true,
                });
                this.setPageIndex({
                    userListPageIndex: '',
                });
                await this.fetchUserListEffect({});

            } catch (error) {
                this.onError(error.message);
                message.error(error.message, 3);
            }
        },
        async updateUserRoleEffect(
            payload: IUpdateUserRolePayload,
            _rootState: any,
        ): Promise<void> {
            try {
                this.onLoading();
                const service = new ServiceProxy();
                const result = await service.updateRoles(payload.id, { roles: payload.roles });
                this.updateUserSuccess(result);
                message.success('Update Success', 3);
                await this.fetchUserListEffect({});
            } catch (error) {
                this.onError(error.message);
                message.error(error.message, 3);
            }
        },
        async redeemPointEffect(
            payload: ICreateRedemptionHistoryInput,
            _rootState: any,
        ): Promise<void> {
            try {
                this.onLoading();
                const service = new ServiceProxy();
                const updateUserDetailResult = await service.redeemPoints(payload.userId, { points: payload.points, reason: payload.reason });
                this.updateUserSuccess(updateUserDetailResult);
                await this.fetchUserListEffect({});

                const userDetail = await service.findUserById('', _rootState.usersPageModels.currentUser._id.toString());
                this.fetchUserDetail(userDetail);
                this.setPageOrientation({
                    redemptionHistoryPageOrientation: true,
                });
                this.setPageIndex({
                    redemptionHistoryPageIndex: '',
                });
                await this.getRedemptionHistoryEffect({});

                this.onChangeScorePointReducer({ inputScorePoint: '' });
                this.onChangeReasonReducer({ inputReason: '' });
                message.success('Redeem Success', 3);
            } catch (error) {
                this.onError(error.message);
                message.error(error.message, 3);
            }
        },
        async getRedemptionHistoryEffect(
            _payload: any,
            _rootState: any,
        ): Promise<void> {
            try {
                this.onLoading();
                const service = new ServiceProxy();
                const result = await service
                    .getRedeemPoints(_rootState.usersPageModels.currentUser._id === undefined ? '' :
                        _rootState.usersPageModels.currentUser._id
                        , '', _rootState.usersPageModels.redemptionHistoryPageIndex,
                        _rootState.usersPageModels.pageSize, 'createdAt',
                        _rootState.usersPageModels.redemptionHistoryPageOrientation);
                if (_rootState.usersPageModels.redemptionHistoryPageOrientation) {
                    this.setOrientationButtonVisibility({
                        isRedemptionHistoryNextDisabled: (result && (result as any).data && (result as any).data.length < 11),
                    });

                    this.setOrientationButtonVisibility({
                        isRedemptionHistoryPrevDisabled: _rootState.usersPageModels.redemptionHistoryFirstPage,
                    });
                } else {
                    this.setOrientationButtonVisibility({
                        isRedemptionHistoryPrevDisabled: (result && (result as any).data && (result as any).data.length < 11),
                    });
                    this.setOrientationButtonVisibility({
                        isRedemptionHistoryNextDisabled: false,
                    });
                }
                if (result && (result as any).data && (result as any).data.length > 10) {
                    (result as any).data.splice(_rootState.usersPageModels.redemptionHistoryPageOrientation ? 10 : 0, 1);
                }
                this.getRedemptionHistorySuccess(result);
            } catch (error) {
                this.onError(error.message);
                message.error(error.message, 3);
            }
        },
        async deleteRedemptionHistoryEffect(
            payload: IDeleteRedemptionHistoryInput,
            _rootState: any,
        ): Promise<void> {
            try {
                this.onLoading();
                const service = new ServiceProxy();
                const updateUserDetailResult = await service.cancelredeemPoints(payload.userId, { redemptionId: payload.redemptionId });
                this.updateUserSuccess(updateUserDetailResult);

                await this.fetchUserListEffect({});

                const userDetail = await service.findUserById('', _rootState.usersPageModels.currentUser._id.toString());
                this.fetchUserDetail(userDetail);

                this.setPageOrientation({
                    redemptionHistoryPageOrientation: true,
                });
                this.setPageIndex({
                    redemptionHistoryPageIndex: '',
                });

                await this.getRedemptionHistoryEffect({});
                message.success('Delete Redemption History Success', 3);
            } catch (error) {
                this.onError(error.message);
                message.error(error.message, 3);
            }
        },
    },
});

export default usersPageModels;
