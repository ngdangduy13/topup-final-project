import { ModelConfig, createModel } from '@rematch/core';
import { ServiceProxy } from '../../../../../client/service-proxies/service-proxies';
import { QuizzPageState, Question } from './state';
import { IErrorPayload } from '../user-page/state';
import { message } from 'antd';

const initialState = {
  listQuizz: { data: [], total: 0 },
  currentQuiz: {
    _id: '',
    coverImageUrl: '',
    title: '',
    description: '',
    state: '',
    createdAt: 0,
    questionCount: 0,
    questions: [],
  },
  questionToCreate: [],

  quizzListPageIndex: '',
  quizzListPageOrientation: true,
  pageSize: 10,
  sortBy: '',

  isQuizzListNextDisabled: false,
  isQuizzListPrevDisabled: true,
  quizzListFirstPage: true,

  isBusy: false,
  errorMessage: '',
};

const quizzPageModel: ModelConfig<QuizzPageState> = createModel({
  state: initialState,
  reducers: {
    onLoading: (state: QuizzPageState): QuizzPageState => {
      return {
        ...state,
        isBusy: true,
      };
    },
    onDone: (state: QuizzPageState): QuizzPageState => {
      return {
        ...state,
        isBusy: false,
      };
    },

    onError: (state: QuizzPageState, payload: IErrorPayload): QuizzPageState => {
      return {
        ...state,
        isBusy: false,
        errorMessage: payload.errorMessage,
      };
    },
    setOrientationButtonVisibility: (state: QuizzPageState, payload: any): QuizzPageState => {
      return {
        ...state,
        ...payload,
      };
    },
    fetchListQuizzSuccessfully: (state: QuizzPageState, payload: any): QuizzPageState => {
      return {
        ...state,
        isBusy: false,
        listQuizz: payload,
      };
    },
    findQuizzSuccessfully: (state: QuizzPageState, payload: any): QuizzPageState => {
      return {
        ...state,
        isBusy: false,
        currentQuiz: payload,
      };
    },
    addQuestionToCreate: (state: QuizzPageState, payload: Question) => {
      const newQuestionToCreate = state.questionToCreate.slice(0);
      return {
        ...state,
        questionToCreate: [...newQuestionToCreate, { id: newQuestionToCreate.length, ...payload }],
      };
    },
    deleteQuestionToCreate: (state: QuizzPageState, payload: number) => {
      const newQuestionToCreate = state.questionToCreate.slice(0);
      newQuestionToCreate.splice(payload, 1);
      return {
        ...state,
        questionToCreate: newQuestionToCreate,
      };
    },
    resetQuestionToCreate: (state: QuizzPageState, _payload: any) => {
      const newQuestionToCreate = state.questionToCreate.slice(0);
      newQuestionToCreate.splice(0, newQuestionToCreate.length);
      return {
        ...state,
        questionToCreate: newQuestionToCreate,
      };
    },
  },
  effects: {
    async fetchListQuizz(_payload: any, rootState: any): Promise<void> {
      try {
        this.onLoading();
        console.log(rootState.profileModel.token);
        const service = new ServiceProxy();
        const result = await service.getAllQuizzes(
          rootState.profileModel.token,
          '',
          '',
          rootState.quizzPageModels.quizzListPageIndex,
          rootState.quizzPageModels.pageSize,
          'createdAt',
          rootState.quizzPageModels.quizzListPageOrientation,
          true,
          '',
          -1,
          -1
        );
        if (rootState.quizzPageModels.quizzListPageOrientation) {
          this.setOrientationButtonVisibility({
            isQuizzListNextDisabled:
              result && (result as any).data && (result as any).data.length < 11,
          });

          this.setOrientationButtonVisibility({
            isQuizzListPrevDisabled: rootState.quizzPageModels.quizzListFirstPage,
          });
        } else {
          this.setOrientationButtonVisibility({
            isQuizzListPrevDisabled:
              result && (result as any).data && (result as any).data.length < 11,
          });
          this.setOrientationButtonVisibility({
            isQuizzListNextDisabled: false,
          });
        }
        if (result && (result as any).data && (result as any).data.length > 10) {
          (result as any).data.splice(
            rootState.quizzPageModels.quizzListPageOrientation ? 10 : 0,
            1
          );
        }
        this.fetchListQuizzSuccessfully(result);
      } catch (error) {
        this.onError({ errorMessage: error.message });
        // message.error(error.message, 3);
      }
    },
    async findQuizzById(payload: any, rootState: any): Promise<void> {
      try {
        this.onLoading();
        const service = new ServiceProxy();
        const quizResult = await service.findQuizz(rootState.profileModel.token, payload.id);
        this.findQuizzSuccessfully(quizResult);
      } catch (error) {
        this.onError({ errorMessage: error.message });
        // message.error(error.message, 3);
      }
    },
    async createNewQuiz(payload: any, rootState: any): Promise<void> {
      try {
        this.onLoading();
        console.log('asdasd', rootState);
        const service = new ServiceProxy();
        const body = {
          coverImageUrl: payload.coverImageUrl,
          title: payload.title,
          description: payload.description,
          state: payload.state,
          questions: rootState.quizzPageModels.questionToCreate,
        };
        await service.createQuiz(rootState.profileModel.token, body);
        message.success('Add new quiz successfully', 3000);
        this.fetchListQuizz();
        this.onDone();
      } catch (error) {
        message.error(error.message, 3000);
        console.log(error);
        this.onError({ errorMessage: error.message });
        // message.error(error.message, 3);
      }
    },
  },
});

export default quizzPageModel;
