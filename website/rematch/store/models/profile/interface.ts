export interface IProfileState {
  _id: string;
  email: string;
  profileImgUrl: string;
  fullName: string;
  dob: string;
  phoneNumber: string;
  i18n: string;
  permissions: string[];
  roles: string[];
  username: string;
  scorePoint: number;
  rewardPoint: number;

  exp?: number;
  iat?: number;

  token: string;
  isLoggedIn: boolean;
  currentLanguage: string;
}

export interface IUpdateProfile {
  token: string;
}
