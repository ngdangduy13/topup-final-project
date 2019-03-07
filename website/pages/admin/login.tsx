import * as React from 'react';
import { Row, Col, Form, Input, Icon, Checkbox, Button } from 'antd';
import '../../static/css/admin/login.less';
import { initStore } from '../../rematch/store';
import withRematch from '../../client/common/hocs/withRematch';
import { FormComponentProps } from 'antd/lib/form';
import { LoginPayload } from '../../rematch/store/models/ui/login-page/state';

export interface LoginPageprops extends FormComponentProps {
  errorMessage: string;
  loginInfoChange: (payload: any) => void;
  isBusy: boolean;
  login: (payload: LoginPayload) => void;
  email: string;
  password: string;
  rememberMe: boolean;
}

class LoginPage extends React.Component<LoginPageprops, any> {
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((error: any, _values: any) => {
      if (!error) {
        this.props.login({
          usernameOrEmail: this.props.email,
          password: this.props.password,
          rememberMe: this.props.rememberMe,
          isMobile: false,
        });
      }
    });
  };

  render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='login-page'>
        <Row>
          <Col xs={0} sm={6} lg={9} />
          <Col xs={24} sm={12} lg={6}>
            <div className='login-form'>
              <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                  <h2>Log In</h2>
                </Form.Item>

                <Form.Item>
                  {this.props.errorMessage && (
                    <div
                      style={{
                        height: '21px',
                        lineHeight: '21px',
                        color: '#f5222d',
                        textAlign: 'center',
                      }}
                    >
                      {this.props.errorMessage}
                    </div>
                  )}
                </Form.Item>

                <Form.Item>
                  {getFieldDecorator('email', {
                    rules: [
                      { required: true, message: 'Please Input Your Username or Email' },
                      // { type: 'email', message: 'Invalid Email Address' }
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  })(
                    <Input
                      prefix={<Icon type='user' />}
                      type='text'
                      placeholder='Email or Username'
                      onChange={(e) =>
                        this.props.loginInfoChange({ email: e.target.value })
                      }
                    />,
                  )}
                </Form.Item>

                <Form.Item>
                  {getFieldDecorator('password', {
                    rules: [
                      { required: true, message: 'Please Input Your Password' },
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  })(
                    <Input
                      prefix={<Icon type='lock' />}
                      type='password'
                      placeholder='Password'
                      onChange={(e) =>
                        this.props.loginInfoChange({ password: e.target.value })
                      }
                    />,
                  )}
                </Form.Item>

                <Form.Item>
                  {getFieldDecorator('rememberMe', {
                    valuePropName: 'checked',
                  })(
                    <Checkbox className='login-form-checkbox'
                      onChange={(checkedValue: any) =>
                        this.props.loginInfoChange({ rememberMe: checkedValue.target.checked })
                      }>
                      Remember Me !
                    </Checkbox>,
                  )}
                </Form.Item>

                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    className='login-form-button'
                    loading={this.props.isBusy}
                  >
                    Log In
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
          <Col xs={0} sm={6} lg={9} />
        </Row>
      </div>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.loginPageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.loginPageModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(LoginPage),
);
