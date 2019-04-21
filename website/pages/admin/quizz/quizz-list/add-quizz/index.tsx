import React from 'react';
import { Icon, Button, Row, Col, Form, Drawer, Typography, Input, Upload, Modal } from 'antd';
import './add-quizz.less';
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
      previewVisible: false,
      previewImage: '',
      fileList: [{
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
    };
  }

  toggleAddQuizz = () => {
    console.log('asd')
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

  uploadFile = async (file: any) => {
    const body = new FormData();
    body.append('tempimage', file);
    body.append('Content-Type', 'image/png');
    const result: any = await fetch('http://localhost:3003/api/uploadImage', {
      method: 'POST', headers: {
        'Content-Type': 'multipart/form-data',
      },
      body
    });
    console.log(result)
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file: any) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }: { fileList: any }) => this.setState({ fileList })

  render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div className="">
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Row>
          <Col span={24} className="button-flex">
            <div className="add">
              <Button
                type="primary"
                onClick={this.toggleAddQuizz}
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
        <Drawer
          width={'50%'}
          placement="right"
          // closable={false}
          onClose={this.toggleAddQuizz}
          visible={this.state.isVisible}
        >
          <Form>
            <Row gutter={16} align="bottom">
              <Typography.Title level={4}>Add new quiz</Typography.Title>
            </Row>
            <Row gutter={16} align="bottom" justify="center">
              <Col xs={12} sm={12} lg={12}>
                <Form.Item label="Title" hasFeedback>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        required: true,
                        message: 'Please fill the title before submitting',
                      },
                    ],
                  })(
                    <Input
                      name="title"
                      prefix={<Icon type="mail" />}
                      placeholder="Title"
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
                  })(
                    <Input
                      name="description"
                      prefix={<Icon type="mail" />}
                      placeholder="Description"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={12} sm={12} lg={12} style={{ height: '100%' }}>
                <Form.Item label="Cover Image">
                  {getFieldDecorator('coverImage', {
                    rules: [
                      {
                        required: true,
                        message: 'Please fill the description before submitting',
                      },
                    ],
                  })(
                    // <div className="uploadContainer">
                    //   <div>
                    //     <div className="iconContainer">
                    //       <Icon type="picture" style={{ fontSize: 50, color: '#1374ce' }} />
                    //     </div>
                    //     <p style={{ paddingTop: 14, fontWeight: 600, color: '#000' }}>Upload cover image</p>
                    //     <input type="file" />
                    //   </div>
                    // </div>
                    <div className="clearfix">
                      <Upload
                        action={this.uploadFile}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                      >
                        {fileList.length >= 3 ? null : uploadButton}
                      </Upload>
                      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                    </div>
                  )}
                </Form.Item>

              </Col>
            </Row>
          </Form>

        </Drawer>
      </div>
    );
  }
}
export default Form.create()(AddQuizz);
