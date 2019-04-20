import React from 'react';
import { Icon, Button, Row, Col, Form } from 'antd';
import './add-user.less';
import { QuizzPageState } from '../../../../../rematch/store/models/ui/quizz-page/state';
export interface AddQuizzProps {
  quizzPageModels: QuizzPageState;
  form: any;
  fetchListQuizz: (payload: any) => void;

}

class AddQuizz extends React.Component<AddQuizzProps, any> {
  constructor(props: Readonly<AddQuizzProps>) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  toggleAddQuizz = () => {
    this.setState({
      isVisible: !this.state.isVisible,
    });
  };

  // addUser = (e: any) => {
  //   e.preventDefault();
  //   this.props.form.validateFields(async (error: any, _values: any) => {
  //     if (!error) {
  //       const email = this.props.form.getFieldValue('email');
  //       const password = this.props.form.getFieldValue('password');
  //       const roles = this.props.form.getFieldValue('role');
  //       const username = this.props.form.getFieldValue('username');
  //       this.props.createUserEffect({ email, password, roles, username });
  //       console.log(email);
  //       console.log(roles);
  //       this.props.form.resetFields();
  //     }
  //   });
  // };


  render(): JSX.Element {
    // const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <div>
        <Row>
          <Col span={24} className="button-flex">
            <div className="add">
              <Button
                type="primary"
                // onClick={this.toggleAddUser}
              >
                <Icon type="plus" /> Add New Quiz
              </Button>
            </div>
            <div className="refresh">
              <Button
                type="primary"
                onClick={() => this.props.fetchListQuizz({})}
                loading={this.props.quizzPageModels.isBusy}
                icon="sync"
              >
                Refresh
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Form.create()(AddQuizz);
