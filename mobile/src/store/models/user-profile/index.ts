
import { createModel } from '@rematch/core';
import { AppState } from '../../state';
import { Toast } from 'native-base';
import config from '../../../config';
import serviceProvider from '../../../services/service.provider';
import ScreenNames from '../../../screens/screen-names';
import { UserInfo, ResetPasswordParams, UpdateUserParams } from './interface';
import { LoginParams, RegisterParams } from '../../../services/service.interface';
import jwtDecode from 'jwt-decode';

const defaultState: UserInfo = {
    email: '',
    _id: '',
    fullName: '',
    username: '',
    token: '',
    isLoggedIn: false,
    scorePoint: 0,
    rewardPoint: 0,
    profileImgUrl: '',
    roles: []
};

const userProfile = createModel({
    state: defaultState, // initial state
    reducers: {
        updateBusyState: (payload: any) => {
            return {
                ...payload
            };
        },
        updateCurrentRoute: (payload: any) => {
            return {
                ...payload
            };
        },
        updateIsUploadingState: (payload: any) => {
            return {
                ...payload
            };
        },
        updateUserInfo: (state: UserInfo, payload: UserInfo) => {
            return {
                ...state,
                ...payload
            };
        },
        logoutSuccess: (state: UserInfo, payload: any) => {
            return {
                ...defaultState
            };
        },
        updateRewardPoint: (state: UserInfo, payload: number) => {
            return {
                ...state,
                rewardPoint: state.rewardPoint + payload
            };
        },
        updateUserSuccess: (state: UserInfo, payload: UpdateUserParams) => {
            const newUser = Object.assign({}, {
                ...state,
                profileImgUrl: payload.profileImgUrl ? payload.profileImgUrl : state.profileImgUrl,
                fullName: payload.fullName ? payload.fullName : state.fullName
            });
            return {
                ...state,
                ...newUser
            };
        },
    },
    effects: (dispatch) => ({
        async login(payload: LoginParams, _rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                const loginResult: any = await serviceProvider.ApiService().login({
                    usernameOrEmail: payload.email,
                    password: payload.password,
                    rememberMe: false,
                    isMobile: true
                });
                const decoded: any = jwtDecode(loginResult.token);
                console.log(decoded);

                this.updateUserInfo({ ...decoded, isLoggedIn: true, token: loginResult.token });
                this.updateCurrentRoute(ScreenNames.Discovery);
                serviceProvider.NavigatorService().navigate(ScreenNames.Discovery, { profileImgUrl: decoded.profileImgUrl });
                dispatch.quizzes.getAllQuizzes({ state: config().quizState.published, isLoadMore: false });
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
                Toast.show({
                    text: 'Wrong password or username',
                    duration: 3000,
                    buttonText: 'OK',
                    type: 'danger'
                });
            } finally {
                this.updateBusyState(false);
            }
        },
        async register(payload: RegisterParams, _rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                const registerResult: any = await serviceProvider.ApiService().register({
                    email: payload.email,
                    password: payload.password,
                    username: payload.username,
                    fullName: payload.fullname,
                    isMobile: true
                });
                const decoded = jwtDecode(registerResult.token);
                this.updateUserInfo({ ...decoded, isLoggedIn: true, token: registerResult.token });
                serviceProvider.NavigatorService().navigate(ScreenNames.RegisterSuccess);
            } catch (error) {
                // tslint:disable-next-line:no-console
                Toast.show({
                    text: error.message,
                    duration: 3000,
                    buttonText: 'OK',
                    type: 'danger'
                });
            } finally {
                this.updateBusyState(false);
            }
        },
        async logout(payload: string, _rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                this.logoutSuccess();
                this.updateCurrentRoute(ScreenNames.Login);
                serviceProvider.NavigatorService().navigate(ScreenNames.Login);
            } catch (error) {
                // tslint:disable-next-line:no-console
                Toast.show({
                    text: error.message,
                    duration: 3000,
                    buttonText: 'OK',
                    type: 'danger'
                });
            } finally {
                this.updateBusyState(false);
            }
        },
        async forgotPassword(payload: string, _rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                const result = await serviceProvider.ApiService().forgotPassword({ email: payload });
                serviceProvider.NavigatorService().navigate(ScreenNames.ResetPassword);
                Toast.show({
                    text: 'Token was sent to your email',
                    duration: 3000,
                    buttonText: 'OK',
                    type: 'success'
                });
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
                Toast.show({
                    text: error.message,
                    duration: 3000,
                    buttonText: 'OK',
                    type: 'danger'
                });
            } finally {
                this.updateBusyState(false);
            }
        },
        async resetPassword(payload: ResetPasswordParams, _rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                const body = {
                    email: payload.email,
                    password: payload.password,
                };
                const result = await serviceProvider.ApiService().resetPassword(
                    payload.token,
                    body
                );
                serviceProvider.NavigatorService().navigate(ScreenNames.Login);
                Toast.show({
                    text: 'Password has changed successfully',
                    duration: 3000,
                    buttonText: 'OK',
                    type: 'success'
                });
            } catch (error) {
                // tslint:disable-next-line:no-console
                Toast.show({
                    text: error.message,
                    duration: 3000,
                    buttonText: 'OK',
                    type: 'danger'
                });
            } finally {
                this.updateBusyState(false);
            }
        },
        async updateUser(payload: UpdateUserParams, rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                const body = {
                    profileImgUrl: payload.profileImgUrl !== '' ? payload.profileImgUrl : rootState.userProfile.profileImgUrl,
                    fullName: payload.fullName !== '' ? payload.fullName : rootState.userProfile.fullName,
                };
                const result = await serviceProvider.ApiService().updateUser(
                    rootState.userProfile.token,
                    rootState.userProfile._id,
                    body
                );
                this.updateUserSuccess(payload);
            } catch (error) {
                // tslint:disable-next-line:no-console
                Toast.show({
                    text: error.message,
                    duration: 3000,
                    buttonText: 'OK',
                    type: 'danger'
                });
            } finally {
                this.updateBusyState(false);
            }
        },
        async uploadImage(payload: any, rootState: AppState): Promise<any> {
            try {
                this.updateIsUploadingState(true);
                const body = new FormData();
                body.append('tempimage', { uri: payload.uri, name: 'photo.png', filename: 'imageName.png', type: 'image/png' });
                body.append('Content-Type', 'image/png');
                const result: any = await fetch('https://lumileds.techkids.io/api/uploadImage', {
                    method: 'POST', headers: {
                        'Content-Type': 'multipart/form-data',
                        token: rootState.userProfile.token
                    },
                    body
                });
                const coverUrl = JSON.parse(result._bodyText).filepath;
                this.updateUser({ profileImgUrl: coverUrl });
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
                Toast.show({
                    text: 'Something wrong! Please try again later',
                    buttonText: 'Okay',
                    type: 'danger'
                });
            } finally {
                this.updateIsUploadingState(false);
            }
        },
    })
});

export default userProfile;
