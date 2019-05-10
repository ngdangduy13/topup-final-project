import React from 'react';
import { Form, Input, Modal, Row, Col, Icon, Upload, Divider } from 'antd';
import './add-question.less';
import { QuizzPageState, Question } from '../../../../rematch/store/models/ui/quizz-page/state';
export interface ModalAddQuestionProps {
  quizzPageModels: QuizzPageState;
  form: any;
  isVisible: boolean;
  toggleAddQuestion: () => void;
  addQuestionToCreate: (payload: Question) => void;

}

class ModalAddQuestion extends React.Component<ModalAddQuestionProps, any> {
  constructor(props: Readonly<ModalAddQuestionProps>) {
    super(props);
    this.state = {
      isCorrect1: true,
      isCorrect2: false,
      isCorrect3: false,
      isCorrect4: false,
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      previewVisible: false,
      previewImage: '',
      fileList: [],
    };
  }

  onChangeCorrect = (param: string) => {
    this.setState({
      isCorrect1: false,
      isCorrect2: false,
      isCorrect3: false,
      isCorrect4: false,
      [param]: true,
    });
  };

  onChangeAnswer = (param: string, text: string) => {
    this.setState({
      [param]: text,
    });
  };

  addQuestion = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields(async (error: any, _values: any) => {
      if (!error) {
        const description = this.props.form.getFieldValue('question');
        this.props.addQuestionToCreate({
          coverType: 'IMAGE',
          coverUrl: this.state.fileList[0].response.file,
          description,
          answers: [
            {
              id: 1,
              description: this.state.answer1,
              isCorrect: this.state.isCorrect1,
            },
            {
              id: 2,
              description: this.state.answer2,
              isCorrect: this.state.isCorrect2,
            },
            {
              id: 3,
              description: this.state.answer3,
              isCorrect: this.state.isCorrect3,
            },
            {
              id: 4,
              description: this.state.answer4,
              isCorrect: this.state.isCorrect4,
            },
          ],
        });
        this.props.form.resetFields();
        this.setState({
          isCorrect1: true,
          isCorrect2: false,
          isCorrect3: false,
          isCorrect4: false,
          answer1: '',
          answer2: '',
          answer3: '',
          answer4: '',
          previewVisible: false,
          previewImage: '',
          fileList: [],
        });
      }
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
        <Modal
          title="Add question"
          visible={this.props.isVisible}
          confirmLoading={this.props.quizzPageModels.isBusy}
          okText="Save"
          cancelText="Cancel"
          onOk={this.addQuestion}
          onCancel={this.props.toggleAddQuestion}
        >
          <div className="input-user-info">
            <Form>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Question" hasFeedback>
                    {getFieldDecorator('question', {
                      rules: [
                        {
                          required: this.props.isVisible,
                          message: 'Question is required!',
                        },
                      ],
                    })(<Input name="question" placeholder="Question" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Cover Image">
                    {getFieldDecorator('coverImage', {
                      rules: [
                        {
                          required: this.props.isVisible,
                          message: 'Cover image is required!',
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

              <Divider>Answers</Divider>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Answer 1">
                    <div style={{ display: 'flex' }}>
                      {getFieldDecorator('answer1', {
                        rules: [
                          {
                            required: this.props.isVisible,
                            message: 'Answer 1 is required!',
                          },
                        ],
                      })(
                        <Input
                          name="answer1"
                          placeholder="Answer 1"
                          onChange={(e: any) => this.onChangeAnswer('answer1', e.target.value)}
                        />
                      )}

                      <Icon
                        type="check-circle"
                        theme="filled"
                        style={{
                          margin: 'auto',
                          fontSize: 25,
                          color: this.state.isCorrect1 ? '#52c41a' : '#595959',
                          marginLeft: 12,
                        }}
                        onClick={() => this.onChangeCorrect('isCorrect1')}
                      />
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Answer 2">
                    <div style={{ display: 'flex' }}>
                      {getFieldDecorator('answer2', {
                        rules: [
                          {
                            required: this.props.isVisible,
                            message: 'Answer 2 is required!',
                          },
                        ],
                      })(
                        <Input
                          name="answer2"
                          placeholder="Answer 2"
                          onChange={(e: any) => this.onChangeAnswer('answer2', e.target.value)}
                        />
                      )}

                      <Icon
                        type="check-circle"
                        theme="filled"
                        style={{
                          margin: 'auto',
                          fontSize: 25,
                          color: this.state.isCorrect2 ? '#52c41a' : '#595959',
                          marginLeft: 12,
                        }}
                        onClick={() => this.onChangeCorrect('isCorrect2')}
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Answer 3">
                    <div style={{ display: 'flex' }}>
                      {getFieldDecorator('answer3', {
                        rules: [
                          {
                            required: this.props.isVisible,
                            message: 'Answer 3 is required!',
                          },
                        ],
                      })(
                        <Input
                          name="answer3"
                          placeholder="Answer 3"
                          onChange={(e: any) => this.onChangeAnswer('answer3', e.target.value)}
                        />
                      )}

                      <Icon
                        type="check-circle"
                        theme="filled"
                        style={{
                          margin: 'auto',
                          fontSize: 25,
                          color: this.state.isCorrect3 ? '#52c41a' : '#595959',
                          marginLeft: 12,
                        }}
                        onClick={() => this.onChangeCorrect('isCorrect3')}
                      />
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Answer 4">
                    <div style={{ display: 'flex' }}>
                      {getFieldDecorator('answer4', {
                        rules: [
                          {
                            required: this.props.isVisible,
                            message: 'Answer 4 is required!',
                          },
                        ],
                      })(
                        <Input
                          name="answer4"
                          placeholder="Answer 4"
                          onChange={(e: any) => this.onChangeAnswer('answer4', e.target.value)}
                        />
                      )}

                      <Icon
                        type="check-circle"
                        theme="filled"
                        style={{
                          margin: 'auto',
                          fontSize: 25,
                          color: this.state.isCorrect4 ? '#52c41a' : '#595959',
                          marginLeft: 12,
                        }}
                        onClick={() => this.onChangeCorrect('isCorrect4')}
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ModalAddQuestion);
