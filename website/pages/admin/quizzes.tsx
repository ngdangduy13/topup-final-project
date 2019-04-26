import React from 'react';
import './quizz/abc.less';

import { RematchDispatch, RematchRootState } from '@rematch/core';
import withRematch from '../../client/common/hocs/withRematch';
import { initStore, models } from '../../rematch/store';
import AdminLayout from '../../client/src/layouts';
import { QuizzPageState } from '../../rematch/store/models/ui/quizz-page/state';
import QuizzList from './quizz/quizz-list';
import AddQuizz from './quizz/add-quizz';
import { Row, Col, Button, Icon } from 'antd';
import QuizzFilter from './quizz/quizz-filter';

// import './quizz/quizzes.less';

export interface UserPageProps {
  fetchListQuizz: (payload: any) => void;
  quizzPageModels: QuizzPageState;
}

class QuizzPage extends React.Component<UserPageProps, any> {
  constructor(props: Readonly<UserPageProps>) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  componentDidMount() {
    this.props.fetchListQuizz({});
  }

  toggleAddQuizz = () => {
    this.setState({
      isVisible: !this.state.isVisible,
    });
  };

  renderQuizList() {
    return (
      <div>
        <QuizzFilter {...this.props} />
        <Row>
          <Col span={24} className="button-flex">
            <div className="add">
              <Button type="primary" onClick={this.toggleAddQuizz}>
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
        <QuizzList {...this.props} />
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <AdminLayout>
        <div className={'quizz-list-page'}>
          {this.state.isVisible ? (
            <AddQuizz {...this.props} toggleAddQuizz={this.toggleAddQuizz} />
          ) : (
            this.renderQuizList()
          )}
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

export default withRematch(initStore, mapStateToProps, mapDispatchToProps)(QuizzPage);
