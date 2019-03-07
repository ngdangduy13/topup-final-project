import { AppSettingsState } from './models/app-setting/state';
import { UserPageState } from './models/ui/user-page/state';

export interface AppState {
    appSettings: AppSettingsState;
    ui: {
        userPage: UserPageState;
    };
}
