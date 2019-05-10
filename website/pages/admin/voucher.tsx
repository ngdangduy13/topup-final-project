import React from 'react';
import './quizz/abc.less';

import { RematchDispatch, RematchRootState } from '@rematch/core';
import withRematch from '../../client/common/hocs/withRematch';
import { initStore, models } from '../../rematch/store';
import AdminLayout from '../../client/src/layouts';
import { Row, Col, Button, Icon, Modal, Form, Input, Upload } from 'antd';
import { VoucherPageState } from '../../rematch/store/models/ui/voucher-page/state';
import VoucherList from './voucher/voucher-list';

// import './quizz/quizzes.less';

export interface UserPageProps {
  fetchListVoucher: (payload: any) => void;
  setPageIndex: (payload: any) => void;
  setPageOrientation: (payload: any) => void;
  setFirstPageCheck: (payload: any) => void;
  createNewVoucher: (payload: any) => void;
  voucherPageModels: VoucherPageState;
  form: any;
}

class QuizzPage extends React.Component<UserPageProps, any> {
  constructor(props: Readonly<UserPageProps>) {
    super(props);
    this.state = {
      isVisible: false,
      fileList: [],
    };
  }

  componentDidMount() {
    this.props.fetchListVoucher({});
  }

  toggleAddVoucher = () => {
    this.setState({
      isVisible: !this.state.isVisible,
    });
  };

  addVoucher = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields(async (error: any, _values: any) => {
      if (!error) {
        const name = this.props.form.getFieldValue('name');
        const description = this.props.form.getFieldValue('description');
        const point = this.props.form.getFieldValue('point');
        this.props.createNewVoucher({
          name,
          description,
          point,
          coverUrl: this.state.fileList[0].response.file,
        });
        this.setState({
          fileList: [],
        });
        this.props.form.resetFields();
      }
    });
  };

  renderVoucherList() {
    return (
      <div>
        {/* <QuizzFilter {...this.props} /> */}
        <Row>
          <Col span={24} className="button-flex">
            <div className="add">
              <Button type="primary" onClick={this.toggleAddVoucher}>
                <Icon type="plus" /> Add New Voucher
              </Button>
            </div>
            <div className="refresh">
              <Button
                type="primary"
                onClick={() => this.props.fetchListVoucher({})}
                loading={this.props.voucherPageModels.isBusy}
                icon="sync"
              >
                Refresh
              </Button>
            </div>
          </Col>
        </Row>
        <VoucherList {...this.props} />
      </div>
    );
  }

  handleChange = (info: any) => {
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);
    this.setState({ fileList });
  };

  render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;

    return (
      <AdminLayout>
        <div className={'quizz-list-page'}>
          {this.renderVoucherList()}
          <Modal
            title="Add/Update Voucher"
            visible={this.state.isVisible}
            confirmLoading={this.props.voucherPageModels.isBusy}
            okText="Save"
            cancelText="Cancel"
            onOk={this.addVoucher}
            onCancel={this.toggleAddVoucher}
          >
            <div className="input-user-info">
              <Form>
                <Form.Item label="Name of voucher" hasFeedback>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: 'Please fill the name before submitting',
                      },
                    ],
                    // initialValue: this.state.currentArticle.name,
                  })(
                    <Input
                      name="name"
                      prefix={<Icon type="mail" />}
                      placeholder="Name of voucher"
                    />
                  )}
                </Form.Item>
                <Form.Item label="Point for exchange" hasFeedback>
                  {getFieldDecorator('point', {
                    rules: [
                      {
                        required: true,
                        message: 'Please fill the point for exchange before submitting',
                      },
                    ],
                    // initialValue: this.state.currentArticle.p,
                  })(
                    <Input
                      name="point"
                      prefix={<Icon type="mail" />}
                      placeholder="Point for exchange"
                    />
                  )}
                </Form.Item>
                <Form.Item label="Description" hasFeedback>
                  {getFieldDecorator('description', {
                    rules: [
                      {
                        required: true,
                        message: 'Please fill the description before submitting',
                      },
                    ],
                    // initialValue: this.state.currentArticle.name,
                  })(
                    <Input.TextArea
                      name="description"
                      rows={12}
                      //   prefix={<Icon type="mail" />}
                      placeholder="Description"
                    />
                  )}
                </Form.Item>
                <Form.Item label="Cover Image">
                  <div className="dropbox">
                    {getFieldDecorator('dragger', {
                      rules: [
                        {
                          required: true,
                          message: 'Please choose data before submitting',
                        },
                      ],
                      //   initialValue: this.state.fileList,
                    })(
                      <Upload.Dragger
                        action="/api/uploadImage"
                        fileList={this.state.fileList}
                        onChange={this.handleChange}
                      >
                        <p className="ant-upload-drag-icon">
                          <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">
                          Click or drag file to this area to choose file to upload
                        </p>
                        <p className="ant-upload-hint">Only support Word documents and images.</p>
                      </Upload.Dragger>
                    )}
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Modal>
        </div>
      </AdminLayout>
    );
  }
}

const mapStateToProps = (rootState: RematchRootState<models>) => {
  return {
    voucherPageModels: rootState.voucherPageModels,
    userProfileData: rootState.profileModel,
  };
};
const mapDispatchToProps = (rootReducer: RematchDispatch<models>) => {
  return {
    ...rootReducer.voucherPageModels,
  };
};

export default withRematch(initStore, mapStateToProps, mapDispatchToProps)(
  Form.create()(QuizzPage)
);
