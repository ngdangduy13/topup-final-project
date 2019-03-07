import { Component } from 'react';
// import withRematch from '../client/common/hocs/withRematch';
// import { models, initStore } from '../rematch/store';
// import { RematchDispatch, RematchRootState } from '@rematch/core';
import { AppSettingsState } from '../rematch/store/models/app-setting/state';
import UserPage from './admin/users';
export interface MainPageState {
    isSidebarCollapsed: boolean;
    openKeys: string[];
    appSetting: AppSettingsState;
}

class MainPage extends Component<MainPageState> {
    constructor(props: Readonly<MainPageState>) {
        super(props);
        this.state = {
            isSidebarCollapsed: false,
        };
    }
    render(): JSX.Element {
        return (
            <UserPage />
        );
    }
}

// const mapStateToProps = (_rootState: RematchRootState<models>) => ({
//     appSetting: _rootState.appSettings,
// });
// const mapDispatchToProps = (_reducer: RematchDispatch<models>) => ({

// });

export default MainPage;
