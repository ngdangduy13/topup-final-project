import React from 'react';
import { Icon, Row, Col, Form, Input, Upload, Modal, Divider, List, Card, Button } from 'antd';
import './add-quizz.less';
import { QuizzPageState } from '../../../../rematch/store/models/ui/quizz-page/state';
import { RcFile } from 'antd/lib/upload/interface';
import ModalAddQuestion from '../modal-add-question';
export interface AddQuizzProps {
  quizzPageModels: QuizzPageState;
  form: any;
  fetchListQuizz: (payload: any) => void;
  toggleAddQuizz: () => void;
}

class AddQuizz extends React.Component<AddQuizzProps, any> {
  constructor(props: Readonly<AddQuizzProps>) {
    super(props);
    this.state = {
      isVisible: false,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      isVisibleModalQuestion: false,
    };
  }


  toggleAddQuestion = () => {
    this.setState({
      isVisibleModalQuestion: !this.state.isVisibleModalQuestion,
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

  uploadFile = async (file: RcFile) => {
    const body = new FormData();
    console.log(file);
    body.append('file', file);
    body.append('filename', file.name);
    body.append('Content-Type', file.type);
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

  handleChange = (info: any) => {
    console.log(info)
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);
    this.setState({ fileList })
  }

  render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div className="">
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const questions = [{
      coverUrl: '/static/temps/images/santa.jpg',
      description: 'It was ___ settlers who brought the Santa Claus tradition to America',
      answers: [{
        isCorrect: true,
        description: 'Bristish'
      },
      {
        isCorrect: false,
        description: 'Bristish'
      },
      {
        isCorrect: false,
        description: 'Bristish'
      },
      {
        isCorrect: false,
        description: 'Bristish'
      }]
    },
    {
      coverUrl: '/static/temps/images/santa.jpg',
      description: 'It was ___ settlers who brought the Santa Claus tradition to America',
      answers: [{
        isCorrect: true,
        description: 'Bristish'
      },
      {
        isCorrect: false,
        description: 'Bristish'
      },
      {
        isCorrect: false,
        description: 'Bristish'
      },
      {
        isCorrect: false,
        description: 'Bristish'
      }]
    }]
    return (
      <div>

        <Form>
          <Divider>Quiz</Divider>
          <Row gutter={24} align="bottom" justify="center">
            <Col xs={12} sm={12} lg={12}>
              <Form.Item label="Title" hasFeedback>
                {getFieldDecorator('title', {
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
            <Col xs={12} sm={12} lg={12}>
              <Form.Item label="Cover Image">
                {getFieldDecorator('coverImage', {
                  rules: [
                    {
                      required: true,
                      message: 'Please fill the description before submitting',
                    },
                  ],
                })(
                  <div className="clearfix">
                    <Upload
                      action='/api/uploadImage'
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                    >
                      {fileList.length === 1 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{ width: '100%', height: 'auto' }} src={previewImage} />
                    </Modal>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Divider>Questions</Divider>
          {questions.map((item: any, index: number) => (
            <div className="questionContainer" key={`question${index}`} >
              <Row gutter={16}>
                <Col xs={14} sm={16} lg={18}>
                  <p><strong>Question {index + 1}:</strong> {item.description}</p>
                  <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={item.answers}
                    renderItem={(item: any, index: number) => (
                      <List.Item key={`answer${index}`}>
                        <Card
                          size="small"
                        >
                          <Row align="middle" justify="center">
                            <div style={{ display: 'flex' }}>
                              <Icon type={item.isCorrect ? 'check' : 'close'} style={{ color: item.isCorrect ? '#52c41a' : 'red', fontSize: 18, marginRight: 8 }} />
                              <span>{item.description}</span>
                            </div>
                          </Row>
                        </Card>
                      </List.Item>
                    )}
                  />
                </Col>
                <Col xs={10} sm={8} lg={6}>
                  <div className="imageContainer">
                    <img src={item.coverUrl} className="coverImage" />
                  </div>
                </Col>
              </Row>
            </div>
          ))}
          <Row>
            <div className="add-container" onClick={this.toggleAddQuestion} >
              <Icon type="plus-circle" theme="filled" style={{ fontSize: 40, color: '#1374ce' }} />
              <div className="add-text">Add question</div>
            </div>
          </Row>
          <div
            style={{
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
              marginTop: 12
            }}
          >
            <Button onClick={this.props.toggleAddQuizz} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={this.props.toggleAddQuizz} type="primary">
              Submit
            </Button>
          </div>
        </Form>
        <ModalAddQuestion
          quizzPageModels={this.props.quizzPageModels}
          isVisible={this.state.isVisibleModalQuestion}
          toggleAddQuestion={this.toggleAddQuestion}
        />
      </div>
    );
  }
}
export default Form.create()(AddQuizz);
