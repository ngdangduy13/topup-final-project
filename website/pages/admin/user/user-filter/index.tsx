import React from 'react';
import { Input, Row, Col, Dropdown, Menu, Button, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import { UserPageState } from '../../../../rematch/store/models/ui/user-page/state';
import config from '../../../../configs';
import _ from 'lodash';

export interface UserFilterProps {
    searchChangeEffect: (payload: any) => void;
    userPage: UserPageState;
    setSelectedRoleFilter: (payload: any) => void;
    setSearchTerm: (payload: any) => void;
}

class UserFilter extends React.Component<UserFilterProps> {
    constructor(props: Readonly<UserFilterProps>) {
        super(props);
        this._onSearchInputFilter = _.debounce(this._onSearchInputFilter, 500);
    }

    _onRoleFilterSelect(clickParams: ClickParam) {
        this.props.setSelectedRoleFilter(clickParams.key);
        this.props.searchChangeEffect({});
    }

    _renderMenu = () => {
        return (
            <Menu onClick={(clickParams: ClickParam) => this._onRoleFilterSelect(clickParams)}>
                <Menu.Item key={'all'}>
                    <a>
                        All
                    </a>
                </Menu.Item>
                <Menu.Item key={config.roles.admin}>
                    <a>
                        Admin
                    </a>
                </Menu.Item>
                <Menu.Item key={config.roles.quizzMaster}>
                    <a>Quizz Master</a>
                </Menu.Item>
            </Menu>
        );
    };
    _onSearchInputFilter(searchTerm: string) {
        this.props.setSearchTerm(searchTerm);
        this.props.searchChangeEffect({
            searchTerm,
            pageOrientation: this.props.userPage.userListPageOrientation,
            sortBy: this.props.userPage.sortBy,
            role: this.props.userPage.selectedRoleFilter,
            pageIndex: this.props.userPage.userListPageIndex,
            pageSize: this.props.userPage.pageSize,
        });
    }

    render(): JSX.Element {
        return (
            <div style={{ margin: '10px 0' }}>
                <Row>
                    <Col span={12}>
                        <Input
                            style={{ width: '70%' }}
                            placeholder='Search username, email,...'
                            key={'filterUserInput'}
                            onChange={(e) => {
                                this._onSearchInputFilter(e.target.value);
                            }} />
                    </Col>
                    <Col span={12}>
                        <b>Role</b>
                        <Dropdown
                            overlay={this._renderMenu()}
                        >
                            <Button style={{ width: '60%', marginLeft: '10px' }}>
                                {
                                    this.props.userPage.selectedRoleFilter === config.roles.admin ? 'Admin' :
                                        this.props.userPage.selectedRoleFilter === config.roles.quizzMaster ? 'Quizz Master' :
                                            'All'
                                } <Icon style={{ float: 'right', marginTop: '3px' }} type='down' />
                            </Button>
                        </Dropdown>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default UserFilter;
