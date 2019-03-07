import { createModel, ModelConfig } from '@rematch/core';
import { IProfileState, IUpdateProfile } from './interface';
import * as jwtDecode from 'jwt-decode';
import * as Cookies from 'js-cookie';
import config from '../../../../configs';

const initialState: IProfileState = {
  _id: '',
  email: '',
  profileImgUrl: '',
  fullName: '',
  dob: '',
  phoneNumber: '',
  i18n: '',
  permissions: [],
  roles: [],
  username: '',
  scorePoint: 0,
  rewardPoint: 0,

  token: '',
  isLoggedIn: false,
  currentLanguage: 'en',
};

const profileModel: ModelConfig<IProfileState> = createModel({
  state: initialState,
  reducers: {
    'loginPageModel/loginSuccess': (state: IProfileState, payload: IUpdateProfile): IProfileState => {
      const tokenData = jwtDecode(payload.token);

      return {
        ...state,
        ...tokenData,
        token: payload.token,
        isLoggedIn: true,
      };
    },
    logOut: (state: IProfileState): IProfileState => {
      Cookies.remove('token', { path: '/', domain: config.nextjs.cookieDomain });
      return {
        ...state,
        token: '',
        isLoggedIn: false,
      };
    },
    onChangeLanguage: (state: IProfileState): IProfileState => {
      if (state.currentLanguage === 'vi') {
        return {
          ...state,
          currentLanguage: 'en',
        };
      } else if (state.currentLanguage === 'en') {
        return {
          ...state,
          currentLanguage: 'vi',
        };
      }
      return {} as any;
    },
  },
  effects: {},
});

export default profileModel;
