import React from 'react';
import './quizz/abc.less';

import { RematchDispatch, RematchRootState } from '@rematch/core';
import withRematch from '../../client/common/hocs/withRematch';
import { initStore, models } from '../../rematch/store';
import AdminLayout from '../../client/src/layouts';
import { QuizzPageState, Question, Answer } from '../../rematch/store/models/ui/quizz-page/state';
import { Row, Divider, Col, List, Typography, Icon, Card } from 'antd';

export interface UserPageProps {
  fetchListQuizz: (payload: any) => void;
  quizzPageModels: QuizzPageState;
}

class DetailQuizzPage extends React.Component<UserPageProps> {
  static async getInitialProps({ store, query }: { store: any; query: any }) {
    store.dispatch.quizzPageModels.findQuizzById({
      id: query.quizId,
    });
  }
  constructor(props: Readonly<UserPageProps>) {
    super(props);
  }

  onChange = (str: any) => {
    console.log('Content change:', str);
    this.setState({ str });
  }

  render(): JSX.Element {
    console.log(this.props.quizzPageModels);
    const { currentQuiz } = this.props.quizzPageModels;
    return (
      <AdminLayout
        sider={
          <div className="siderContainer">
            <div className="sider">
              <Row>
                <img src={currentQuiz.coverImageUrl} className="coverImage" />
                <Divider />
                <div style={{ marginLeft: 10 }}>
                  <Typography.Title editable={{ onChange: this.onChange }} level={4}>{currentQuiz.title}</Typography.Title >

                </div>
                <Divider />
                <div style={{ marginLeft: 10 }}>
                  <Typography.Paragraph editable={{ onChange: this.onChange }}>{currentQuiz.description}</Typography.Paragraph >

                </div>
              </Row>
            </div>
          </div>
        }
      >
        <div className={'quizz-list-page'}>
          {currentQuiz.questions.map((item: Question, index: number) => (
            <div>
              <Row className="questionContainer">
                <Col xs={13} sm={15} lg={17}>
                  <p><strong>Question {index + 1}:</strong> {item.description}</p>
                  <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={item.answers}
                    renderItem={(item: Answer) => (
                      <List.Item>
                        <Card
                          size="small"
                        >

                          <Row align="middle" justify="center">
                            <Col xs={4} sm={4} lg={4}>
                              <Icon type={item.isCorrect ? 'check' : 'close'} style={{ color: item.isCorrect ? '#52c41a' : 'red', fontSize: 18 }} />

                            </Col>
                            <Col xs={18} sm={18} lg={18} >
                              <span>{item.description}</span>
                            </Col>
                          </Row>

                        </Card>


                      </List.Item>
                    )}
                  />,
                </Col>
                <Col xs={1} sm={1} lg={1} />
                <Col xs={10} sm={8} lg={6}>
                  <img src={item.coverUrl} className="coverImage" />
                </Col>
              </Row>
              <Divider />
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }
}

const mapStateToProps = (rootState: RematchRootState<models>) => {
  return {
    quizzPageModels: rootState.quizzPageModels,
    userProfileData: rootState.profileModel,
  };
};
const mapDispatchToProps = (rootReducer: RematchDispatch<models>) => {
  return {
    ...rootReducer.quizzPageModels,
  };
};

export default withRematch(initStore, mapStateToProps, mapDispatchToProps)(DetailQuizzPage);
