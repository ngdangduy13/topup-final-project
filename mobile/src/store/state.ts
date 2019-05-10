
import { UiAppState } from './models/app/interface';
import { Language } from './models/language/interface';
import { UserInfo } from './models/user-profile/interface';
import { NavigationState } from './models/navigation/interface';
import { QuizzesState } from './models/quizzes/interface';
import { ScoreboardState } from './models/scoreboard/interface';
import { VoucherState } from './models/voucher/interface';

export interface AppState {
    appState: UiAppState;
    language: Language;
    userProfile: UserInfo;
    navigation: NavigationState;
    voucher: VoucherState;
    quizzes: QuizzesState;
    scoreboard: ScoreboardState;
}
