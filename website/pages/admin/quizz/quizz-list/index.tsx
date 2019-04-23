import React from 'react';
import { Table, Button, Tooltip, Icon, Tag } from 'antd';
import './quizz-list.less';
// import { IFindUserDetail } from '../../../../api/modules/auth/users/interface';
import { QuizzPageState } from '../../../../rematch/store/models/ui/quizz-page/state';
import moment from 'moment';
import Router from 'next/router';
export interface QuizzListProps {
  quizzPageModels: QuizzPageState;
  fetchListQuizz: (payload: any) => void;

}

class QuizzList extends React.Component<QuizzListProps, any> {
  constructor(props: Readonly<QuizzListProps>) {
    super(props);
  }

  renderState = (_text: any, record: any, index: any) => {
    let color;
    if (record.state === 'PUBLISHED') {
      color = 'green';
    } else if (record.state === 'DRAFT') {
      color = 'orange';
    } else if (record.state === 'REMOVED') {
      color = 'red';
    }
    return (
      <span>
        <Tag color={color} key={index}>
          {record.state}
        </Tag>
      </span>
    );
  };

  _renderColumns() {
    return [
      {
        title: 'Actions',
        key: 'actions',
        className: 'alignCenter',
        align: 'center' as 'center',
        width: '10%',
        render: (_text: any, record: any, _index: any) => (
          <div style={{ justifyContent: 'space-around' }}>
            <span style={{ cursor: 'pointer', marginRight: 6 }}>
              <Tooltip title={'View details'}>
                <Icon
                  style={{ color: '#3FA9FF' }}
                  type="info-circle"
                  onClick={() => Router.push(`/admin/detail-quizz?quizId=${record._id}`)}
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
        title: <span>Title</span>,
        dataIndex: 'title' as 'title',
        width: '45%',
        key: 'title',
      },
      {
        title: <span>No. of question</span>,
        dataIndex: 'questionCount' as 'questionCount',
        width: '10%',
        align: 'center' as 'center',
        key: 'questionCount',
      },
      {
        title: <span>State</span>,
        dataIndex: 'state' as 'state',
        width: '10%',
        align: 'center' as 'center',
        key: 'state',
        render: this.renderState,
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt' as 'createdAt',
        key: 'createdAt',
        render: (_text: any, record: any, _index: any) => (
          <span>{moment(record.createdAt).format('YYYY-MM-DD, h:mm:ss a')}</span>
        ),
      },
    ];
  }
  //   _onPageChange(isNext = true) {
  //     this.props.setPageIndex({
  //       QuizzListPageIndex: isNext
  //         ? this.props.userPage.listUser.data[this.props.userPage.listUser.data.length - 1].createdAt.toString()
  //         : this.props.userPage.listUser.data[0].createdAt.toString(),
  //     });
  //     this.props.setPageOrientation({
  //       QuizzListPageOrientation: isNext,
  //     });
  //     this.props.fetchQuizzListEffect({});
  //     if (isNext) {
  //       this.props.setFirstPageCheck({ QuizzListFirstPage: false });
  //     }
  //   }
  render(): JSX.Element {
    return (
      <div>
        <Table
          loading={this.props.quizzPageModels.isBusy}
          dataSource={this.props.quizzPageModels.listQuizz.data}
          rowKey="_id"
          columns={this._renderColumns()}
          scroll={{ x: 1000 }}
          pagination={false}
        />
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <Button
            style={{ marginRight: '10px' }}
            // onClick={() => this._onPageChange(false)}
            disabled={this.props.quizzPageModels.isQuizzListPrevDisabled}
          >
            {'<'}
          </Button>
          <Button
            // onClick={() => this._onPageChange()}
            disabled={this.props.quizzPageModels.isQuizzListNextDisabled}
          >
            {'>'}
          </Button>
        </div>
      </div>
    );
  }
}
export default QuizzList;
