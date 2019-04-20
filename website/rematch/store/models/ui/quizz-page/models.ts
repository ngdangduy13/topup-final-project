import { ModelConfig, createModel } from '@rematch/core';
import { ServiceProxy } from '../../../../../client/service-proxies/service-proxies';
import { QuizzPageState } from './state';
import { IErrorPayload } from '../user-page/state';

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

  quizzListPageIndex: '',
  quizzListPageOrientation: false,
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
  },
  effects: {
    async fetchListQuizz(_payload: any, rootState: any): Promise<void> {
      try {
        this.onLoading();
        const service = new ServiceProxy();
        const result = await service.getAllQuizzes(
          rootState.profileModel.token,
          '',
          '',
          rootState.quizzPageModels.quizzListPageIndex,
          rootState.quizzPageModels.pageSize,
          'createdAt',
          rootState.quizzPageModels.quizzListPageOrientation
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
  },
});

export default quizzPageModel;
