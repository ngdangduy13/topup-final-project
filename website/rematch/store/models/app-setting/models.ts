import { createModel } from '@rematch/core';
import { AppSettingsState } from './state';

const initialState: AppSettingsState = {
    apiUrl: '',
    clientUrl: '',
    language: '',
    maxPageSize: 0,
    pagination: {
        pageSizes: 0,
        defaultPageSize: 0,
    },
    isBusy: false,
};

export default createModel({
    state: initialState,
    reducers: {

    },
    effects: {
        
    },
});
