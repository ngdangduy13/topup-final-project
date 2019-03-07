
import { createModel } from '@rematch/core';
import { UiAppState } from './interface';

const defaultState: UiAppState = {
    isBusy: false,
    isUploadingImage: false,
    isLoadingMore: false
};

export default createModel({
    state: defaultState, // initial state
    reducers: {
        // handle state changes with pure functions
        'userProfile/updateBusyState': (state: UiAppState, payload: boolean) => {
            return {
                ...state,
                isBusy: payload
            };
        },
        'quizzes/updateBusyState': (state: UiAppState, payload: boolean) => {
            return {
                ...state,
                isBusy: payload
            };
        },
        'quizzes/updateIsUploadingState': (state: UiAppState, payload: boolean) => {
            return {
                ...state,
                isUploadingImage: payload
            };
        },
        'quizzes/updateLoadingMoreState': (state: UiAppState, payload: boolean) => {
            return {
                ...state,
                isLoadingMore: payload
            };
        },
        'userProfile/updateIsUploadingState': (state: UiAppState, payload: boolean) => {
            return {
                ...state,
                isUploadingImage: payload
            };
        },
        'scoreboard/updateBusyState': (state: UiAppState, payload: boolean) => {
            return {
                ...state,
                isBusy: payload
            };
        },
    },
    effects: (_dispatch) => ({

    })
});
