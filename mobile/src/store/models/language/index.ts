
import { createModel } from '@rematch/core';
import { Language } from './interface';
import { AppState } from '../../state';
import i18next from '../../../helpers/i18next';

const defaultState: Language = {
    language: 'en'
};

export default createModel({
    state: defaultState, // initial state
    reducers: {
        // handle state changes with pure functions
        changeLanguageSuccess: (state: Language, payload: string) => {
            return {
                ...state,
                language: payload
            };
        },
    },
    effects: (_dispatch) => ({
        changeLanguage(payload: string, rootState: AppState): void {
            try {
                if (rootState.language.language === payload) {
                    return;
                }
                i18next.changeLanguage(payload);
                this.changeLanguageSuccess(payload);
            // tslint:disable-next-line:no-empty
            } catch (error) {
            }
        },
    })
});
