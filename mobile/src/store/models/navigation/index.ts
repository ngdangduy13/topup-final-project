
import { createModel } from '@rematch/core';
import { NavigationState } from './interface';

const defaultState: NavigationState = {
    currentRoute: '',
};

const navigation = createModel({
    state: defaultState, // initial state
    reducers: {
        updateCurrentRoute: (state: NavigationState, payload: string) => {
            return {
                ...state,
                currentRoute: payload,
            };
        },
        'userProfile/updateCurrentRoute': (state: NavigationState, payload: string) => {
            return {
                ...state,
                currentRoute: payload
            };
        },
        'quizzes/updateCurrentRoute': (state: NavigationState, payload: string) => {
            return {
                ...state,
                currentRoute: payload
            };
        },
    },
    effects: (_dispatch) => ({
    }),
});

export default navigation;
