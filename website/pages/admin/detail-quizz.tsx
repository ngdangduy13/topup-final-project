import React from 'react';
import './quizz/abc.less';

import { RematchDispatch, RematchRootState } from '@rematch/core';
import withRematch from '../../client/common/hocs/withRematch';
import { initStore, models } from '../../rematch/store';
import AdminLayout from '../../client/src/layouts';
import { QuizzPageState, Question } from '../../rematch/store/models/ui/quizz-page/state';
import { Row, Divider, Col } from 'antd';

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

                <h3>{currentQuiz.title}</h3>
                <Divider />
                <p>{currentQuiz.description}</p>
              </Row>
            </div>
          </div>
        }
      >
        <div className={'quizz-list-page'}>
          {currentQuiz.questions.map((item: Question) => (
            <div>
              <Row className="questionContainer">
                <Col xs={14} sm={16} lg={18}>
                  <p>{item.description}</p>
                </Col>
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
