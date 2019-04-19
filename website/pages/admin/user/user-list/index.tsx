import React from 'react';
import { Table, Icon, Tooltip, Button } from 'antd';
import './user-list.less';
import { UserPageState } from '../../../../rematch/store/models/ui/user-page/state';
import { IFindUserDetail } from '../../../../api/modules/auth/users/interface';
import config from '../../../../configs';
import moment from 'moment';
export interface UserListProps {
    userPage: UserPageState;
    switchUserProfileVisibility: (payload: boolean) => void;
    fetchUserDetail: (payload: IFindUserDetail) => void;
    setPageIndex: (payload: any) => void;
    fetchUserListEffect: (payload: any) => void;
    setPageOrientation: (payload: any) => void;
    setFirstPageCheck: (payload: any) => void;
}

class UserList extends React.Component<UserListProps, any> {

    constructor(props: Readonly<UserListProps>) {
        super(props);
    }

    _renderUserProfile(_item: IFindUserDetail) {
        this.props.switchUserProfileVisibility(this.props.userPage.isUserProfileOpen);
        this.props.fetchUserDetail(this.props.userPage.listUser.data.filter((user) => user._id.toString() === _item._id.toString())[0]);
    }

    _renderRoleColumn(item: any) {
        return (
            <span>{item.roles.map((role: any) => `${
                role === config.roles.admin ? 'Admin' : 'Quizz Master'
                }${item.roles.indexOf(role) === item.roles.length - 1 ? '' : ', '}`)}</span>
        );
    }

    _renderColumns() {
        return [{
            title: 'Actions',
            key: 'actions',
            className: 'alignCenter',
            align: 'center' as 'center',
            width: '7%',
            render: (item: IFindUserDetail) => (
                <span style={{ cursor: 'pointer' }}>
                    <Tooltip title='Edit'>
                        <Icon onClick={() => this._renderUserProfile(item)} style={{ color: '#3FA9FF' }} type='form' />
                    </Tooltip>
                </span>
            ),
        }, {
            title: (<span>Username</span>),
            dataIndex: 'username' as 'username',
            width: '11%',
            key: 'username',
        }, {
            title: (<span>Email</span>),
            dataIndex: 'email' as 'email',
            width: '20%',
            key: 'email',
        }, {
            title: 'Roles',
            dataIndex: 'roles' as 'roles',
            width: '14%',
            key: 'roles',
            render: (_text: any, item: any, _index: any) => this._renderRoleColumn(item),
        }, {
            title: 'Score Point',
            dataIndex: 'scorePoint' as 'scorePoint',
            key: 'scorePoint',
            align: 'center' as 'center',
            className: 'numberInput',
            width: '12%',
            render: (_text: any, item: any, _index: any) => (
                <span>
                    {item.scorePoint.toLocaleString()}
                </span>
            ),
        }, {
            title: 'Reward Point',
            dataIndex: 'rewardPoint' as 'rewardPoint',
            key: 'rewardPoint',
            width: '12%',
            align: 'center' as 'center',
            className: 'numberInput',
            render: (_text: any, item: any, _index: any) => (
                <span>
                    {item.rewardPoint.toLocaleString()}
                </span>
            ),
        }, {
            title: 'Created At',
            dataIndex: 'createdAt' as 'createdAt',
            key: 'createdAt',
            render: (_text: any, item: any, _index: any) => (
                <span>
                    {moment(item.createdAt).format('YYYY-MM-DD, h:mm:ss a')}
                </span>
            ),
        }];
    }
    _onPageChange(isNext = true) {
        this.props.setPageIndex({
            userListPageIndex: isNext ?
                this.props.userPage.listUser.data[this.props.userPage.listUser.data.length - 1].createdAt.toString() :
                this.props.userPage.listUser.data[0].createdAt.toString(),
        });
        this.props.setPageOrientation({
            userListPageOrientation: isNext,
        });
        this.props.fetchUserListEffect({});
        if (isNext) {
            this.props.setFirstPageCheck({ userListFirstPage: false });
        }
    }
    render(): JSX.Element {
        return (
            <div>
                <Table
                    loading={this.props.userPage.isBusy}
                    dataSource={this.props.userPage.listUser.data}
                    rowKey='_id'
                    columns={this._renderColumns()}
                    scroll={{ x: 1300 }}
                    pagination={false}
                />
                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <Button
                        style={{ marginRight: '10px' }}
                        onClick={() => this._onPageChange(false)}
                        disabled={this.props.userPage.isUserListPrevDisabled}>
                        {'<'}
                    </Button>
                    <Button onClick={() => this._onPageChange()} disabled={this.props.userPage.isUserListNextDisabled}>
                        {'>'}
                    </Button>
                </div>
            </div>
        );
    }
}
export default UserList;
