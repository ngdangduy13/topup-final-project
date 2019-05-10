import { ModelConfig, createModel } from '@rematch/core';
import { LoginPageState, OnErrorPayload, LoginPayload } from './state';
import { ServiceProxy } from '../../../../../client/service-proxies/service-proxies';
import * as qs from 'qs';
import Router from 'next/router';
import * as jwtDecode from 'jwt-decode';
import { ITokenData } from '../../../../../api/modules/auth/auth/interface';
import config from '../../../../../configs';

const initialState = {
  email: '',
  password: '',
  rememberMe: false,

  isBusy: false,
  errorMessage: '',
};

const loginPageModel: ModelConfig<LoginPageState> = createModel({
  state: initialState,
  reducers: {
    loginInfoChange: (state: LoginPageState, payload: any): LoginPageState => {
      return {
        ...state,
        ...payload,
      };
    },
    onLoading: (state: LoginPageState): LoginPageState => {
      return {
        ...state,
        isBusy: true,
      };
    },
    onError: (state: LoginPageState, payload: OnErrorPayload): LoginPageState => {
      return {
        ...state,
        isBusy: false,
        errorMessage: payload.errorMessage,
      };
    },
    loginSuccess: (state: LoginPageState, _payload: any): LoginPageState => {
      return {
        ...state,
        isBusy: false,
        rememberMe: false,
      };
    },
  },
  effects: {
    async login(payload: LoginPayload, _rootState: any): Promise<void> {
      try {
        this.onLoading();
        const service = new ServiceProxy();
        const result = await service.login(payload);
        this.loginSuccess(result);
        const callbackUrl = qs.parse(window.location.search, { ignoreQueryPrefix: true })
          .callbackUrl;
        let tokenData: ITokenData = {} as any;
        tokenData = jwtDecode((result as any).token);
        console.log(tokenData);
        if (tokenData.roles.indexOf(config.roles.admin) !== -1) {
          Router.push('/admin/users');
        } else if (tokenData.roles.indexOf(config.roles.quizzMaster) !== -1) {
          Router.push('/admin/quizzes');
        } else {
          throw new Error('Unauthorized');
        }
        if (callbackUrl) {
          Router.push(callbackUrl);
        }
      } catch (error) {
        this.onError({ errorMessage: error.message });
        // message.error(error.message, 3);
      }
    },
  },
});

export default loginPageModel;
