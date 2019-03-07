import React from 'react';
import UserList from './user/user-list';
import './user/users.less';
import UserFilter from './user/user-filter';
import UserProfile from './user/user-profile';
import { RematchDispatch, RematchRootState } from '@rematch/core';
import {
    UserPageState,
    IUpdateUserRolePayload,
    ICreateRedemptionHistoryInput,
    IDeleteRedemptionHistoryInput,
} from '../../rematch/store/models/ui/user-page/state';
import withRematch from '../../client/common/hocs/withRematch';
import { initStore, models } from '../../rematch/store';
import AdminLayout from '../../client/src/layouts';
import { IProfileState } from '../../rematch/store/models/profile/interface';
export interface UserPageProps {
    fetchUserListEffect: (payload: any) => void;
    switchUserProfileVisibility: (payload: boolean) => void;
    userPage: UserPageState;
    searchChangeEffect: (payload: any) => void;
    fetchUserDetail: (payload: any) => void;
    onChangeScorePointReducer: (payload: any) => void;
    onChangeReasonReducer: (payload: any) => void;
    setSelectedRole: (payload: string[]) => void;
    updateUserRoleEffect: (payload: IUpdateUserRolePayload) => void;
    redeemPointEffect: (payload: ICreateRedemptionHistoryInput) => void;
    getRedemptionHistoryEffect: (payload: any) => void;
    deleteRedemptionHistoryEffect: (payload: IDeleteRedemptionHistoryInput) => void;
    userProfileData: IProfileState;
    setPageIndex: (payload: any) => void;
    setPageOrientation: (payload: any) => void;
    setFirstPageCheck: (payload: any) => void;
    setSelectedRoleFilter: (payload: any) => void;
    setSearchTerm: (payload: any) => void;
}

class UserPage extends React.Component<UserPageProps> {
    constructor(props: Readonly<UserPageProps>) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchUserListEffect({});
    }

    _renderUserProfile() {
        return (<UserProfile {...this.props} />);
    }

    _renderUserList() {
        return (
            <div className={'user-list-page'}>
                <UserFilter {...this.props} />
                <UserList {...this.props} />
            </div>
        );
    }

    render(): JSX.Element {
        return (
            <AdminLayout>
                {
                    this.props.userPage.isUserProfileOpen ?
                        this._renderUserProfile() :
                        this._renderUserList()
                }
            </AdminLayout>
        );
    }
}

const mapStateToProps = (rootState: RematchRootState<models>) => {
    return {
        userPage: rootState.usersPageModels,
        userProfileData: rootState.profileModel,
    };
};
const mapDispatchToProps = (rootReducer: RematchDispatch<models>) => {
    return {
        ...rootReducer.usersPageModels,
    };
};

export default withRematch(initStore, mapStateToProps, mapDispatchToProps)(UserPage);
