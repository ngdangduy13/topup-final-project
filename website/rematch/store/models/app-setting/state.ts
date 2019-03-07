import { UiAppState } from '../../../../client/common/interface/uiAppState';

export interface AppSettingsState extends UiAppState {
    language: string;
    apiUrl: string;
    clientUrl: string;
    maxPageSize: number;
    pagination: {
        defaultPageSize: number;
        pageSizes: number;
    };
}
