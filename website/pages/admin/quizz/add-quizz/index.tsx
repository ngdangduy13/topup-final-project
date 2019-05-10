import React from 'react';
import { Icon, Row, Col, Form, Input, Upload, Modal, Divider, List, Card, Button } from 'antd';
import './add-quizz.less';
import { QuizzPageState, Question } from '../../../../rematch/store/models/ui/quizz-page/state';
import { RcFile } from 'antd/lib/upload/interface';
import ModalAddQuestion from '../modal-add-question';
export interface AddQuizzProps {
  quizzPageModels: QuizzPageState;
  form: any;
  fetchListQuizz: (payload: any) => void;
  toggleAddQuizz: () => void;
  addQuestionToCreate: (payload: Question) => void;
  createNewQuiz: (payload: any) => void;
  resetQuestionToCreate: () => void;
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

  addQuiz = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields(async (error: any, _values: any) => {
      if (!error) {
        const title = this.props.form.getFieldValue('titleQuiz');
        const description = this.props.form.getFieldValue('descriptionQuiz');
        this.props.createNewQuiz({
          title,
          description,
          coverImageUrl: this.state.fileList[0].response.file,
          state: 'PUBLISHED',
        });
        // this.props.form.resetFields();
        // this.setState({ fileList: [], isVisible: false, previewVisible: false, previewImage: '' });
        // this.props.resetQuestionToCreate();
      }
    });
  };

  uploadFile = async (file: RcFile) => {
    const body = new FormData();
    body.append('file', file);
    body.append('filename', file.name);
    body.append('Content-Type', file.type);
    await fetch('http://localhost:3003/api/uploadImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file: any) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = (info: any) => {
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);
    this.setState({ fileList });
  };

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
        <Form>
          <Divider>Quiz</Divider>
          <Row gutter={24} align="bottom" justify="center">
            <Col xs={12} sm={12} lg={12}>
              <Form.Item label="Title" hasFeedback>
                {getFieldDecorator('titleQuiz', {
                  rules: [
                    {
                      required: true,
                      message: 'Please fill the title before submitting',
                    },
                  ],
                })(<Input name="title" prefix={<Icon type="mail" />} placeholder="Title" />)}
              </Form.Item>
              <Form.Item label="Description" hasFeedback>
                {getFieldDecorator('descriptionQuiz', {
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
                {getFieldDecorator('coverImageQuiz', {
                  rules: [
                    {
                      required: true,
                      message: 'Please upload cover image before submitting',
                    },
                  ],
                })(
                  <div className="clearfix">
                    <Upload
                      action="/api/uploadImage"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                    >
                      {fileList.length === 1 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img
                        alt="example"
                        style={{ width: '100%', height: 'auto' }}
                        src={previewImage}
                      />
                    </Modal>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Divider>Questions</Divider>
          {this.props.quizzPageModels.questionToCreate.map((item: Question, index: number) => (
            <div className="questionContainer" key={`question${index}`}>
              <Row gutter={16}>
                <Col xs={14} sm={16} lg={18}>
                  <p>
                    <strong>Question {index + 1}:</strong> {item.description}
                  </p>
                  <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={item.answers}
                    renderItem={(item: any, index: number) => (
                      <List.Item key={`answer${index}`}>
                        <Card size="small">
                          <Row align="middle" justify="center">
                            <div style={{ display: 'flex' }}>
                              <Icon
                                type={item.isCorrect ? 'check' : 'close'}
                                style={{
                                  color: item.isCorrect ? '#52c41a' : 'red',
                                  fontSize: 18,
                                  marginRight: 8,
                                }}
                              />
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
                    <img src={`http://localhost:3003${item.coverUrl}`} className="coverImage" />
                  </div>
                </Col>
              </Row>
            </div>
          ))}
          <Row>
            <div className="add-container" onClick={this.toggleAddQuestion}>
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
              marginTop: 12,
            }}
          >
            <Button onClick={this.props.toggleAddQuizz} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={this.addQuiz} type="primary">
              Submit
            </Button>
          </div>
        </Form>
        <ModalAddQuestion
          // {...this.props}
          addQuestionToCreate={this.props.addQuestionToCreate}
          quizzPageModels={this.props.quizzPageModels}
          isVisible={this.state.isVisibleModalQuestion}
          toggleAddQuestion={this.toggleAddQuestion}
        />
      </div>
    );
  }
}
export default Form.create()(AddQuizz);
