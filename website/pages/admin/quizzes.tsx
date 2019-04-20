import React from 'react';
import './quizz/abc.less';

import { RematchDispatch, RematchRootState } from '@rematch/core';
import withRematch from '../../client/common/hocs/withRematch';
import { initStore, models } from '../../rematch/store';
import AdminLayout from '../../client/src/layouts';
import { QuizzPageState } from '../../rematch/store/models/ui/quizz-page/state';
import QuizzList from './quizz/quizz-list';
// import './quizz/quizzes.less';


export interface UserPageProps {
  fetchListQuizz: (payload: any) => void;
  quizzPageModels: QuizzPageState;
}

class QuizzPage extends React.Component<UserPageProps> {
  constructor(props: Readonly<UserPageProps>) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchListQuizz({});
  }

  render(): JSX.Element {
    return (
      <AdminLayout>
        <div className={'quizz-list-page'}>
          <QuizzList {...this.props} />
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
