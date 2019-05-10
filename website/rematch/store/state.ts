import { AppSettingsState } from './models/app-setting/state';
import { UserPageState } from './models/ui/user-page/state';
import { LoginPageState } from './models/ui/login-page/state';
import { IProfileState } from './models/profile/interface';
import { QuizzPageState } from './models/ui/quizz-page/state';
import { VoucherPageState } from './models/ui/voucher-page/state';

export interface AppState {
  appSettings: AppSettingsState;
  usersPageModels: UserPageState;
  loginPageModel: LoginPageState;
  profileModel: IProfileState;
  quizzPageModels: QuizzPageState;
  voucherPageModels: VoucherPageState;
}
