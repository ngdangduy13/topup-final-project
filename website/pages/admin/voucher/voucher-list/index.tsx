import React from 'react';
import { Table, Button, Tooltip, Icon } from 'antd';
import './quizz-list.less';
// import { IFindUserDetail } from '../../../../api/modules/auth/users/interface';
import moment from 'moment';
import { VoucherPageState } from '../../../../rematch/store/models/ui/voucher-page/state';
export interface QuizzListProps {
  fetchListVoucher: (payload: any) => void;
  setPageIndex: (payload: any) => void;
  setPageOrientation: (payload: any) => void;
  setFirstPageCheck: (payload: any) => void;
  voucherPageModels: VoucherPageState;
}

class VoucherList extends React.Component<QuizzListProps, any> {
  constructor(props: Readonly<QuizzListProps>) {
    super(props);
  }

  _renderColumns() {
    return [
      {
        title: 'Actions',
        key: 'actions',
        className: 'alignCenter',
        align: 'center' as 'center',
        width: '10%',
        // fixed: 'left',
        render: (_text: any, _record: any, _index: any) => (
          <div style={{ justifyContent: 'space-around' }}>
            <span style={{ cursor: 'pointer', marginRight: 6 }}>
              <Tooltip title={'View details'}>
                <Icon
                  style={{ color: '#3FA9FF' }}
                  type="info-circle"
                  // onClick={() => Router.push(`/admin/detail-quizz?quizId=${record._id}`)}
                />
              </Tooltip>
            </span>

            <span style={{ cursor: 'pointer' }}>
              <Tooltip title="Edit">
                <Icon style={{ color: '#3FA9FF' }} type="form" />
              </Tooltip>
            </span>
          </div>
        ),
      },
      {
        title: <span>Name</span>,
        dataIndex: 'name' as 'name',
        width: 150,
        key: 'name',
        // fixed: 'left',
      },
      {
        title: <span>Description</span>,
        dataIndex: 'description' as 'description',
        width: 700,
        align: 'center' as 'center',
        key: 'description',
      },
      {
        title: <span>Point For Exchange</span>,
        dataIndex: 'pointForExchange' as 'pointForExchange',
        width: '10%',
        align: 'center' as 'center',
        key: 'pointForExchange',
        // render: this.renderState,
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt' as 'createdAt',
        key: 'createdAt',
        width: 250,
        render: (_text: any, record: any, _index: any) => (
          <span>{moment(record.createdAt).format('YYYY-MM-DD, h:mm:ss a')}</span>
        ),
      },
    ];
  }
  
  _onPageChange(isNext = true) {
    this.props.setPageIndex({
      voucherListPageIndex: isNext
        ? this.props.voucherPageModels.listVoucher.data[
            this.props.voucherPageModels.listVoucher.data.length - 1
          ].createdAt.toString()
        : this.props.voucherPageModels.listVoucher.data[0].createdAt.toString(),
    });
    this.props.setPageOrientation({
      voucherListPageOrientation: isNext,
    });
    this.props.fetchListVoucher({});
    if (isNext) {
      this.props.setFirstPageCheck({ voucherListFirstPage: false });
    }
  }

  render(): JSX.Element {
    return (
      <div>
        <Table
          loading={this.props.voucherPageModels.isBusy}
          dataSource={(this.props.voucherPageModels.listVoucher as any).data}
          rowKey="_id"
          columns={this._renderColumns()}
          scroll={{ x: 1500 }}
          pagination={false}
        />
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <Button
            style={{ marginRight: '10px' }}
            onClick={() => this._onPageChange(false)}
            disabled={this.props.voucherPageModels.isVoucherListPrevDisabled}
          >
            {'<'}
          </Button>
          <Button
            onClick={() => this._onPageChange()}
            disabled={this.props.voucherPageModels.isVoucherListNextDisabled}
          >
            {'>'}
          </Button>
        </div>
      </div>
    );
  }
}
export default VoucherList;
