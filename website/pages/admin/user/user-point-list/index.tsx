import React from 'react';
import { Tooltip, Icon, Table, Popconfirm, Button } from 'antd';
import { UserPageState, IDeleteRedemptionHistoryInput } from '../../../../rematch/store/models/ui/user-page/state';
import { IFindRempHistoryDetail } from '../../../../api/modules/quizzes/redemption-history/interface';
import '../user-list/user-list.less';
import moment from 'moment';

export interface UserPointListProps {
    userPage: UserPageState;
    getRedemptionHistoryEffect: (payload: any) => void;
    deleteRedemptionHistoryEffect: (payload: IDeleteRedemptionHistoryInput) => void;
    setPageIndex: (payload: any) => void;
    setPageOrientation: (payload: any) => void;
    setFirstPageCheck: (payload: any) => void;
}

// const tempData = [{
//     point: '100',
//     reason: 'exchange for product A',
//     createdAt: '03/12/2018 15:00',
// }];

class UserPointList extends React.Component<UserPointListProps> {
    constructor(props: Readonly<UserPointListProps>) {
        super(props);
    }
    _deleteRedemptionHistory(item: IFindRempHistoryDetail) {
        this.props.deleteRedemptionHistoryEffect({ userId: item.userId, redemptionId: item._id });
    }

    private _columns = [{
        title: 'Actions',
        key: 'actions',
        align: 'center' as 'center',
        width: '13%',
        render: (item: IFindRempHistoryDetail) => (
            <span style={{ cursor: 'pointer' }}>
                <Tooltip title='Delete'>
                    <Popconfirm
                        title='Are you sure to delete this redemption history?'
                        okText='Yes'
                        onConfirm={() => this._deleteRedemptionHistory(item)}
                        cancelText='No'>
                        <Icon style={{ color: '#3FA9FF' }} type='delete' />
                    </Popconfirm>
                </Tooltip>
            </span>
        ),
    }, {
        title: 'Point',
        dataIndex: 'points' as 'points',
        key: 'points',
        className: 'numberInput',
        width: '10%',
        render: (_text: any, item: any, _index: any) => (
            <span>
                {item.points.toLocaleString()}
            </span>
        ),
    }, {
        title: 'Reason',
        dataIndex: 'reason' as 'reason',
        key: 'reason',
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

    componentDidMount() {
        this.props.getRedemptionHistoryEffect({});
    }

    _onPageChange(isNext = true) {
        this.props.setPageIndex({
            redemptionHistoryPageIndex: isNext ?
                this.props.userPage.redemptionHistory.data[this.props.userPage.redemptionHistory.data.length - 1].createdAt.toString() :
                this.props.userPage.redemptionHistory.data[0].createdAt.toString(),
        });
        this.props.setPageOrientation({
            redemptionHistoryPageOrientation: isNext,
        });
        this.props.getRedemptionHistoryEffect({});
        if (isNext) {
            this.props.setFirstPageCheck({ redemptionHistoryFirstPage: false });
        }
    }

    render(): JSX.Element {
        return (
            <div style={{ marginTop: '30px' }}>
                <Table
                    dataSource={this.props.userPage.redemptionHistory.data}
                    rowKey={'_id'}
                    loading={this.props.userPage.isBusy}
                    columns={this._columns}
                    pagination={false} />
                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <Button
                        style={{ marginRight: '10px' }}
                        onClick={() => this._onPageChange(false)}
                        disabled={this.props.userPage.isRedemptionHistoryPrevDisabled}>
                        {'<'}
                    </Button>
                    <Button onClick={() => this._onPageChange()} disabled={this.props.userPage.isRedemptionHistoryNextDisabled}>
                        {'>'}
                    </Button>
                </div>
            </div>
        );
    }
}

export default UserPointList;
