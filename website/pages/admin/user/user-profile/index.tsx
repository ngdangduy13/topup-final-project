import * as React from 'react';
import './user-profile.less';
import { Row, Col, Input, Button, Checkbox } from 'antd';
import {
    IUpdateUserRolePayload,
    ICreateRedemptionHistoryInput,
    UserPageState,
    IDeleteRedemptionHistoryInput,
} from '../../../../rematch/store/models/ui/user-page/state';
import config from '../../../../configs';
import UserPointList from '../user-point-list';
import { IProfileState } from '../../../../rematch/store/models/profile/interface';
export interface UserProfileProps {
    switchUserProfileVisibility: (payload: boolean) => void;
    setSelectedRole: (payload: string[]) => void;
    updateUserRoleEffect: (payload: IUpdateUserRolePayload) => void;
    redeemPointEffect: (payload: ICreateRedemptionHistoryInput) => void;
    onChangeScorePointReducer: (payload: any) => void;
    onChangeReasonReducer: (payload: any) => void;
    userPage: UserPageState;
    getRedemptionHistoryEffect: (payload: any) => void;
    deleteRedemptionHistoryEffect: (payload: IDeleteRedemptionHistoryInput) => void;
    fetchUserListEffect: (payload: any) => void;
    setPageIndex: (payload: any) => void;
    userProfileData: IProfileState;
    setPageOrientation: (payload: any) => void;
    setFirstPageCheck: (payload: any) => void;
}

class UserProfile extends React.Component<UserProfileProps, any> {
    constructor(props: Readonly<UserProfileProps>) {
        super(props);
    }
    private _listRole: string[] = [];

    _renderUserList() {
        this.props.switchUserProfileVisibility(this.props.userPage.isUserProfileOpen);
        this.props.setPageIndex({
            redemptionHistoryPageIndex: '',
        });
        this.props.onChangeScorePointReducer({ inputScorePoint: '' });
        this.props.onChangeReasonReducer({ inputReason: '' });
    }

    _redeemPoint() {
        // tslint:disable-next-line:radix
        this.props.redeemPointEffect({ points: parseInt(this.props.userPage.inputScorePoint), reason: this.props.userPage.inputReason, userId: (this.props.userPage.currentUser as any)._id });
    }

    _updateUserRoles() {
        this.props.updateUserRoleEffect({ id: (this.props.userPage.currentUser as any)._id, roles: (this.props.userPage.currentUser as any).roles });
    }
    componentDidMount() {
        this._listRole = (this.props.userPage.currentUser as any).roles;
    }

    _setUserRoles(_role: string) {
        if (this._listRole.filter((role: string) => role === _role).length === 0) {
            this._listRole.push(_role);
        } else {
            this._listRole.splice(this._listRole.indexOf(_role), 1);
        }
        this.props.setSelectedRole(this._listRole);
    }
    _onInputScorePointChange(inputScorePoint: string) {
        this.props.onChangeScorePointReducer({ inputScorePoint });
    }

    _onInputReasonChange(inputReason: string) {
        this.props.onChangeReasonReducer({ inputReason });
    }
    render(): JSX.Element {
        return (
            <div>
                <Button onClick={() => this._renderUserList()} style={{ marginLeft: '10px', marginTop: '10px' }}>
                    Back
                </Button>
                <div className={'user-profile-page'}>
                    <div className={'profile-wrapper'}>
                        <h1>Profile</h1>
                        <Row className={'row'} gutter={16}>
                            <Col style={{ verticalAlign: 'center' }} span={4}>
                                Id
                    </Col>
                            <Col span={12}>
                                <Input className={'input'} disabled={true} value={(this.props.userPage.currentUser as any)._id} />
                            </Col>
                            <Col span={8} />
                        </Row>
                        <Row className={'row'} gutter={16}>
                            <Col span={4}>
                                Username
                    </Col>
                            <Col span={12}>
                                <Input className={'input'} disabled={true} value={(this.props.userPage.currentUser as any).username} />
                            </Col>
                            <Col span={8} />
                        </Row>
                        <Row className={'row'} gutter={16}>
                            <Col span={4}>
                                Email
                    </Col>
                            <Col span={12}>
                                <Input className={'input'} disabled={true} value={(this.props.userPage.currentUser as any).email} />
                            </Col>
                            <Col span={8} />
                        </Row>
                        <Row className={'row'} gutter={16}>
                            <Col span={4}>
                                Role
                    </Col>
                            <Col span={12}>
                                <Checkbox
                                    disabled={(this.props.userPage.currentUser as any)._id.toString() === this.props.userProfileData._id.toString()}
                                    onChange={() => this._setUserRoles(config.roles.admin)}
                                    checked={(this.props.userPage.currentUser as any).roles.filter((role: string) => role === config.roles.admin).length > 0}>
                                    Admin
                                </Checkbox>
                                <Checkbox
                                    onChange={() => this._setUserRoles(config.roles.quizzMaster)}
                                    checked={(this.props.userPage.currentUser as any).roles.filter((role: string) => role === config.roles.quizzMaster).length > 0}>
                                    Quizz Master
                                </Checkbox>
                            </Col>
                            <Col span={8} />
                        </Row>
                        <Row className={'row'} gutter={16}>
                            <Col span={4}>
                            </Col>
                            <Col span={12}>
                                <Button loading={this.props.userPage.isBusy} onClick={() => this._updateUserRoles()}>
                                    Update
                        </Button>
                            </Col>
                            <Col span={8} />
                        </Row>
                    </div>
                    <div className={'point-wrapper'}>
                        <h1>Points</h1>
                        <Row className={'row'} gutter={16}>
                            <Col span={4}>
                                Score Point
                    </Col>
                            <Col span={12}>
                                <Input className={'input'} disabled={true} value={(this.props.userPage.currentUser as any).scorePoint} />
                            </Col>
                            <Col span={8} />
                        </Row>
                        <Row className={'row'} style={{ marginBottom: '30px' }} gutter={16}>
                            <Col span={4}>
                                Reward Point
                    </Col>
                            <Col span={12}>
                                <Input className={'input'} disabled={true} value={(this.props.userPage.currentUser as any).rewardPoint} />
                            </Col>
                            <Col span={8} />
                        </Row>
                        <b>Redeem Points</b>
                        <Row className={'row'} style={{ marginTop: '10px' }} gutter={16}>
                            <Col span={4}>
                                Point
                    </Col>
                            <Col span={12}>
                                <Input
                                    className={'input'}
                                    type={'text'}
                                    key={'inputScore'}
                                    onChange={(e) => this._onInputScorePointChange(e.target.value)}
                                    value={this.props.userPage.inputScorePoint}
                                />
                            </Col>
                            <Col span={8} />
                        </Row>
                        <Row className={'row'} gutter={16}>
                            <Col span={4}>
                                Reason
                    </Col>
                            <Col span={12}>
                                <Input className={'input'} value={this.props.userPage.inputReason} onChange={(e) => this._onInputReasonChange(e.target.value)} />
                            </Col>
                            <Col span={8} />
                        </Row>
                        <Row className={'row'} gutter={16}>
                            <Col span={4}>
                            </Col>
                            <Col span={12}>
                                <Button onClick={() => this._redeemPoint()}>
                                    Redeem
                        </Button>
                            </Col>
                            <Col span={8} />
                        </Row>
                        <UserPointList
                            getRedemptionHistoryEffect={this.props.getRedemptionHistoryEffect}
                            userPage={this.props.userPage}
                            deleteRedemptionHistoryEffect={this.props.deleteRedemptionHistoryEffect}
                            setPageIndex={this.props.setPageIndex}
                            setPageOrientation={this.props.setPageOrientation}
                            setFirstPageCheck={this.props.setFirstPageCheck}
                        />
                    </div>
                </div>
            </div >
        );
    }
}

export default UserProfile;
