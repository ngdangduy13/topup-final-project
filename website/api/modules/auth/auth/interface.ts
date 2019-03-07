export interface ILoginInput {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
  isMobile: boolean;
}

export interface ITokenData {
  _id: string;
  email: string;
  profileImgUrl: string;
  fullName: string;
  dob: Date;
  phoneNumber: string;
  i18n: string;
  permissions: string[];
  roles: string[];
  username: string;
  rewardPoint: number;
  scorePoint: number;

  exp?: number;
  iat?: number;
}
