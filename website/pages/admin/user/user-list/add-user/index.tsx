import React from 'react';
import { Icon, Button, Row, Col, Modal, Form, Input, Select } from 'antd';
import './add-user.less';
import { UserPageState } from '../../../../../rematch/store/models/ui/user-page/state';
import { IFindUserDetail } from '../../../../../api/modules/auth/users/interface';
import config from '../../../../../configs/';
export interface AddUserProps {
  userPage: UserPageState;
  form: any;
  switchUserProfileVisibility: (payload: boolean) => void;
  fetchUserDetail: (payload: IFindUserDetail) => void;
  setPageIndex: (payload: any) => void;
  createUserEffect: (payload: any) => void;
  fetchUserListEffect: (payload: any) => void;
  setPageOrientation: (payload: any) => void;
  setFirstPageCheck: (payload: any) => void;
}

class AddUser extends React.Component<AddUserProps, any> {
  constructor(props: Readonly<AddUserProps>) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  toggleAddUser = () => {
    this.setState({
      isVisible: !this.state.isVisible,
    });
  };

  addUser = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields(async (error: any, _values: any) => {
      if (!error) {
        const email = this.props.form.getFieldValue('email');
        const password = this.props.form.getFieldValue('password');
        const roles = this.props.form.getFieldValue('role');
        const username = this.props.form.getFieldValue('username');
        this.props.createUserEffect({ email, password, roles, username });
        console.log(email);
        console.log(roles);
        this.props.form.resetFields();
      }
    });
  };

  hasErrors = (fieldsError: any) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  compareToFirstPassword = (_rule: any, value: any, callback: any) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  render(): JSX.Element {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <div>
        <Row>
          <Col span={24} className="button-flex">
            <div className="add">
              <Button type="primary" onClick={this.toggleAddUser}>
                <Icon type="plus" /> Add New Users
              </Button>
            </div>
            <div className="refresh">
              <Button
                type="primary"
                onClick={() => this.props.fetchUserListEffect({})}
                loading={this.props.userPage.isBusy}
                icon="sync"
              >
                Refresh
              </Button>
            </div>
          </Col>
        </Row>
        <Modal
          title="Add User"
          visible={this.state.isVisible}
          confirmLoading={this.props.userPage.isBusy}
          okText="Save"
          cancelText="Cancel"
          onOk={this.addUser}
          onCancel={this.toggleAddUser}
          okButtonProps={{
            disabled: this.hasErrors(getFieldsError()),
          }}
        >
          <div className="input-user-info">
            <Form>
              <Form.Item label="Email" hasFeedback>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: 'Please fill the email before submitting',
                    },
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                  ],
                })(
                  <Input
                    name="email"
                    prefix={<Icon type="mail" />}
                    placeholder="Email"
                    // onChange={e => this.setState({ title: e.target.value })}
                    // disabled={this.props.currentUser._id ? true : false}
                  />
                )}
              </Form.Item>
              <Form.Item label="User name" hasFeedback>
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: 'Please fill the email before submitting',
                    },
                  ],
                })(
                  <Input
                    prefix={<Icon type="profile" />}
                    name="username"
                    placeholder="User name"
                    // onChange={e => this.setState({ description: e.target.value })}
                  />
                )}
              </Form.Item>
              <Form.Item label="Password" hasFeedback>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: 'Please fill the password before submitting',
                    },
                    {
                      pattern: config.usersModuleConfig.passwordRegex,
                      message:
                        'Password must include at least 1 capitalized letter, 1 special letter and minimum 8 characters',
                    },
                  ],
                })(
                  <Input
                    prefix={<Icon type="lock" />}
                    name="password"
                    type="password"
                    placeholder="Password"
                    // onChange={e => this.setState({ description: e.target.value })}
                  />
                )}
              </Form.Item>
              <Form.Item label="Confirm Password" hasFeedback>
                {getFieldDecorator('confirmPassword', {
                  rules: [
                    {
                      required: true,
                      message: 'Please fill the confirm password before submitting',
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(
                  <Input
                    prefix={<Icon type="lock" />}
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    // onChange={e => this.setState({ description: e.target.value })}
                  />
                )}
              </Form.Item>
              <Form.Item label="Role" hasFeedback>
                {getFieldDecorator('role')(
                  <Select
                    mode="multiple"
                    size="default"
                    placeholder="Please select"
                    // onChange={handleChange}
                    style={{ width: '100%' }}
                  >
                    <Select.Option key="ADMINISTRATOR">Admin</Select.Option>
                    <Select.Option key="QUIZZMASTER">Quiz Master</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(AddUser);
