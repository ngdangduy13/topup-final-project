// import { Store } from 'redux';
import { init } from '@rematch/core';
import models from './models';
// import userPageModels from './models/ui/user-page/models';
// import loginPageModel from './models/ui/login-page/models';
// import { AppState } from './state';

export const initStore = (initialState: any = {}) => {
    return init({
        models,
        redux: {
            initialState,
        },
    });
};

export { models };
export type models = typeof models;
