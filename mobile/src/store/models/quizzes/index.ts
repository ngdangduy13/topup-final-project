
import { createModel } from '@rematch/core';
import {
    QuizzesState, Question, CreateQuizParams, Answer,
    UpdateAnswerParams, UpdateIsCorrectParams,
    SingleQuiz, QuestionAnswer, UpdateQuizToCreateParam, QuestionResult, QuestionChecklist, UpdateQuizParams
} from './interface';
import serviceProvider from '../../../services/service.provider';
import { AppState } from '../../state';
import ScreenNames from '../../../screens/screen-names';
import { StatusBar } from 'react-native';
import { Toast } from 'native-base';
import config from '../../../config';
import _ from 'lodash';
import { EPROTONOSUPPORT } from 'constants';

const defaultQuestion: Question = {
    id: 0,
    coverType: 'IMAGE',
    coverUrl: '',
    description: '',
    answers: [{
        id: 0,
        description: 'Answer A',
        isCorrect: false
    }, {
        id: 1,
        description: 'Answer B',
        isCorrect: false
    }, {
        id: 2,
        description: 'Answer C',
        isCorrect: false
    }, {
        id: 3,
        description: 'Answer D',
        isCorrect: false
    }]
};

const defaultState: QuizzesState = {
    allQuizzesPublished: [],
    allQuizzesDraft: [],
    allQuizzesRemoved: [],
    allQuizzesSearched: [],
    allQuizzesBeacon: [],
    questionToCreate: [
        {
            id: 0,
            coverType: 'IMAGE',
            coverUrl: '',
            description: '',
            answers: [{
                id: 0,
                description: 'Answer A',
                isCorrect: false
            }, {
                id: 1,
                description: 'Answer B',
                isCorrect: false
            }, {
                id: 2,
                description: 'Answer C',
                isCorrect: false
            }, {
                id: 3,
                description: 'Answer D',
                isCorrect: false
            }]
        }
    ],
    quizToCreate: {
        _id: '',
        coverType: 'IMAGE',
        title: '',
        coverImageUrl: '',
        description: '',
        state: 'DRAFT',
        createdAt: '',
        beacon: {
            isActive: false,
            minor: '',
            major: '',
            uuid: ''
        }
    },
    quizIsPlaying: {
        _id: '',
        coverImageUrl: '',
        title: '',
        description: '',
        state: 'DRAFT',
        createdAt: 0,
        questionCount: 0,
        beacon: {
            isActive: false,
            minor: '',
            major: '',
            uuid: ''
        },
        questions: []
    },
    questionAnswer: [],
    questionResult: {
        correctAnswerCount: 0,
        points: 0,
    },
    questionChecklist: {
        isHavingCoverUrl: [false],
        isHavingQuestion: [false]
    },
    endOfList: {
        PUBLISHED: false,
        DRAFT: false,
        REMOVED: false,
        SEARCHED: false,
    }
};

const navigation = createModel({
    state: defaultState, // initial state
    reducers: {
        updateBusyState: (payload: any) => {
            return {
                ...payload
            };
        },
        updateCurrentRoute: (payload: any) => {
            return {
                ...payload
            };
        },
        updateIsUploadingState: (payload: any) => {
            return {
                ...payload
            };
        },
        updateLoadingMoreState: (payload: any) => {
            return {
                ...payload
            };
        },
        updateQuestionAnswer: (state: QuizzesState, payload: QuestionAnswer) => {
            return {
                ...state,
                questionAnswer: [...state.questionAnswer, payload],
            };
        },
        updateQuestionChecklist: (state: QuizzesState, payload: QuestionChecklist) => {
            return {
                ...state,
                questionChecklist: payload,
            };
        },
        updateEndOfList: (state: QuizzesState, payload: { state: string, value: boolean }) => {
            const newEndOfList = {
                PUBLISHED: payload.state === config().quizState.published ? payload.value : state.endOfList.PUBLISHED,
                DRAFT: payload.state === config().quizState.draft ? payload.value : state.endOfList.DRAFT,
                REMOVED: payload.state === config().quizState.removed ? payload.value : state.endOfList.REMOVED,
                SEARCHED: payload.state === config().quizState.searched ? payload.value : state.endOfList.SEARCHED,
            };
            return {
                ...state,
                endOfList: newEndOfList,
            };
        },
        updateIsHavingCoverUrl: (state: QuizzesState, payload: { index: number, value: boolean }) => {
            const newQuestionChecklist = Object.assign({}, state.questionChecklist);
            newQuestionChecklist.isHavingCoverUrl.splice(payload.index, 1, payload.value);
            return {
                ...state,
                questionChecklist: newQuestionChecklist,
            };
        },
        updateIsHavingQuestion: (state: QuizzesState, payload: { index: number, value: boolean }) => {
            const newQuestionChecklist = Object.assign({}, state.questionChecklist);
            newQuestionChecklist.isHavingQuestion.splice(payload.index, 1, payload.value);
            return {
                ...state,
                questionChecklist: newQuestionChecklist,
            };
        },
        updateQuestionResult: (state: QuizzesState, payload: { value: SingleQuiz[], isLoadMore: boolean }) => {
            return {
                ...state,
                questionResult: payload,
            };
        },
        removeQuizzesBeacon: (state: QuizzesState, payload: string) => {
            return {
                ...state,
                allQuizzesBeacon: [],
            };
        },
        getQuizzesBeaconSuccess: (state: QuizzesState, payload: { value: SingleQuiz[], isLoadMore: boolean }) => {
            return {
                ...state,
                allQuizzesBeacon: payload.isLoadMore ? [...state.allQuizzesPublished, ...payload.value] : payload.value,
            };
        },
        getQuizzesPublishedSuccess: (state: QuizzesState, payload: { value: SingleQuiz[], isLoadMore: boolean }) => {
            return {
                ...state,
                allQuizzesPublished: payload.isLoadMore ? [...state.allQuizzesPublished, ...payload.value] : payload.value,
            };
        },
        getQuizzesDraftSuccess: (state: QuizzesState, payload: { value: SingleQuiz[], isLoadMore: boolean }) => {
            return {
                ...state,
                allQuizzesDraft: payload.isLoadMore ? [...state.allQuizzesDraft, ...payload.value] : payload.value,
            };
        },
        getQuizzesRemovedSuccess: (state: QuizzesState, payload: { value: SingleQuiz[], isLoadMore: boolean }) => {
            return {
                ...state,
                allQuizzesRemoved: payload.isLoadMore ? [...state.allQuizzesRemoved, ...payload.value] : payload.value,
            };
        },
        getQuizzesSearchedSuccess: (state: QuizzesState, payload: { value: SingleQuiz[], isLoadMore: boolean }) => {
            return {
                ...state,
                allQuizzesSearched: payload.isLoadMore ? [...state.allQuizzesSearched, ...payload.value] : payload.value,
            };
        },
        deleteQuizSuccess: (state: QuizzesState, payload: { index: number, state: string }) => {
            const newAllQuizzes = payload.state === config().quizState.published
                ? state.allQuizzesPublished.slice(0)
                : state.allQuizzesDraft.slice(0);
            newAllQuizzes.splice(payload.index, 1);
            return {
                ...state,
                allQuizzesPublished: payload.state === config().quizState.published ? newAllQuizzes : state.allQuizzesPublished,
                allQuizzesDraft: payload.state === config().quizState.draft ? newAllQuizzes : state.allQuizzesDraft,
            };
        },
        restoreQuizSuccess: (state: QuizzesState, payload: string) => {
            const newAllQuizzes = state.allQuizzesRemoved.slice(0);
            const index = _.findIndex(newAllQuizzes, (i) => i._id === payload);
            newAllQuizzes.splice(index, 1);
            return {
                ...state,
                allQuizzesRemoved: newAllQuizzes
            };
        },
        deleteQuestionToCreate: (state: QuizzesState, payload: number) => {
            const newQuestionToCreate = state.questionToCreate.slice(0);
            newQuestionToCreate.splice(payload, 1);
            const newQuestionChecklist: any = Object.assign({}, state.questionChecklist);
            Object.keys(newQuestionChecklist).map((item: any) => newQuestionChecklist[item].splice(payload, 1));
            return {
                ...state,
                questionToCreate: newQuestionToCreate,
                questionChecklist: newQuestionChecklist
            };
        },
        resetQuestionAnswer: (state: QuizzesState, payload: string) => {
            return {
                ...state,
                questionAnswer: [],
            };
        },
        addNewQuestion: (state: QuizzesState, payload: QuizzesState) => {
            const newQuestion: Question = Object.assign({}, defaultQuestion);
            return {
                ...state,
                questionToCreate: [...state.questionToCreate, { ...newQuestion, id: state.questionToCreate.length }],
                questionChecklist: {
                    isHavingCoverUrl: [...state.questionChecklist.isHavingCoverUrl, false],
                    isHavingQuestion: [...state.questionChecklist.isHavingQuestion, false],
                }
            };
        },
        resetQuizToCreate: (state: QuizzesState, payload: string) => {
            return {
                ...state,
                questionToCreate: [],
                quizToCreate: {
                    _id: '',
                    coverType: 'IMAGE',
                    title: '',
                    coverImageUrl: '',
                    description: '',
                    state: 'DRAFT',
                    createdAt: 0,
                    beacon: {
                        isActive: false,
                        minor: '',
                        major: '',
                        uuid: ''
                    }
                },
                questionChecklist: {
                    isHavingCoverUrl: [],
                    isHavingQuestion: []
                }
            };
        },
        updateCoverUrlQuizToCreate: (state: QuizzesState, payload: string) => {
            return {
                ...state,
                quizToCreate: {
                    ...Object.assign({}, state.quizToCreate),
                    coverImageUrl: payload
                }
            };
        },
        updateQuizToCreate: (state: QuizzesState, payload: UpdateQuizToCreateParam) => {
            const newQuizToCreate = {
                ...state.quizToCreate,
                _id: payload._id ? payload._id : state.quizToCreate._id,
                title: payload.title ? payload.title : state.quizToCreate.title,
                description: payload.description ? payload.description : state.quizToCreate.description,
                state: payload.state ? payload.state : state.quizToCreate.state,
                coverImageUrl: payload.coverImageUrl ? payload.coverImageUrl : state.quizToCreate.coverImageUrl,
                beacon: {
                    isActive: payload.isActive !== undefined ? payload.isActive : state.quizToCreate.beacon.isActive,
                    minor: payload.minor ? payload.minor : state.quizToCreate.beacon.minor,
                    major: payload.major ? payload.major : state.quizToCreate.beacon.major,
                    uuid: payload.uuid ? payload.uuid : state.quizToCreate.beacon.uuid,
                }
            };
            return {
                ...state,
                quizToCreate: newQuizToCreate
            };
        },

        updateQuizIsPlaying: (state: QuizzesState, payload: SingleQuiz) => {
            return {
                ...state,
                quizIsPlaying: payload
            };
        },
        addQuestionToCreate: (state: QuizzesState, payload: Question[]) => {
            return {
                ...state,
                questionToCreate: payload
            };
        },
        updateTitleQuestion: (state: QuizzesState, payload: { title: string, index: number }) => {
            const newQuestion: Question = {
                ...Object.assign({}, state.questionToCreate[payload.index]),
                description: payload.title
            };
            const newQuestionToCreate = state.questionToCreate.slice(0);
            newQuestionToCreate.splice(payload.index, 1, newQuestion);
            return {
                ...state,
                questionToCreate: newQuestionToCreate
            };
        },
        updateCoverUrlQuestion: (state: QuizzesState, payload: { coverUrl: string, index: number }) => {
            const newQuestion: Question = {
                ...Object.assign({}, state.questionToCreate[payload.index]),
                coverUrl: payload.coverUrl
            };
            const newQuestionToCreate = state.questionToCreate.slice(0);
            newQuestionToCreate.splice(payload.index, 1, newQuestion);
            return {
                ...state,
                questionToCreate: newQuestionToCreate
            };
        },
        updateAnswer: (state: QuizzesState, payload: UpdateAnswerParams) => {
            const newAnswer: Answer = {
                ...Object.assign({}, state.questionToCreate[payload.indexQuestion].answers[payload.indexAnswer]),
                description: payload.answer
            };

            const newAnswers = state.questionToCreate[payload.indexQuestion].answers.slice(0);
            newAnswers.splice(payload.indexAnswer, 1, newAnswer);

            const newQuestion = {
                ...Object.assign({}, state.questionToCreate[payload.indexQuestion]),
                answers: newAnswers
            };

            const newQuestionToCreate = state.questionToCreate.slice(0);
            newQuestionToCreate.splice(payload.indexQuestion, 1, newQuestion);
            return {
                ...state,
                questionToCreate: newQuestionToCreate
            };
        },
        updateIsCorrect: (state: QuizzesState, payload: UpdateIsCorrectParams) => {
            const newAnswer: Answer = {
                ...Object.assign({}, state.questionToCreate[payload.indexQuestion].answers[payload.indexAnswer]),
                isCorrect: state.questionToCreate[payload.indexQuestion].answers[payload.indexAnswer].isCorrect ? false : true
            };

            const newAnswers = state.questionToCreate[payload.indexQuestion].answers.slice(0);
            newAnswers.map((item: Answer, index) => item.isCorrect = false);
            newAnswers.splice(payload.indexAnswer, 1, newAnswer);

            const newQuestion = {
                ...Object.assign({}, state.questionToCreate[payload.indexQuestion]),
                answers: newAnswers
            };

            const newQuestionToCreate = state.questionToCreate.slice(0);
            newQuestionToCreate.splice(payload.indexQuestion, 1, newQuestion);
            return {
                ...state,
                questionToCreate: newQuestionToCreate
            };
        },
        addQuiz: (state: QuizzesState, payload: SingleQuiz) => {
            const newAllQuizzes = [...state.allQuizzesPublished.slice(0), payload];
            return {
                ...state,
                allQuizzesPublished: newAllQuizzes
            };
        }
    },
    effects: (_dispatch) => ({
        async getAllQuizzes(payload: { state: string, isLoadMore: boolean }, rootState: AppState): Promise<any> {
            try {
                !payload.isLoadMore
                    ? this.updateBusyState(true)
                    : this.updateLoadingMoreState(true);
                let pageIndex: string = '';
                if (payload.isLoadMore) {
                    if (payload.state === config().quizState.published) {
                        const length = rootState.quizzes.allQuizzesPublished.length;
                        pageIndex = length === 0
                            ? ''
                            : rootState.quizzes.allQuizzesPublished[length - 1].createdAt;
                    } else if (payload.state === config().quizState.draft) {
                        const length = rootState.quizzes.allQuizzesDraft.length;
                        pageIndex = length === 0
                            ? ''
                            : rootState.quizzes.allQuizzesDraft[length - 1].createdAt;
                    } else if (payload.state === config().quizState.removed) {
                        const length = rootState.quizzes.allQuizzesRemoved.length;
                        pageIndex = length === 0
                            ? ''
                            : rootState.quizzes.allQuizzesRemoved[length - 1].createdAt;
                    }
                }
                const pageSize = 50;
                const result: any = await serviceProvider.ApiService().getAllQuizzes(
                    rootState.userProfile.token,
                    '',
                    payload.state,
                    pageIndex,
                    pageSize,
                    'createdAt',
                    true,
                    false,
                    '',
                    0,
                    0,
                );
                const data = result.data.map((item: any, index: number) => {
                    return {
                        ...item,
                    };
                });
                if (data.length === 51) {
                    data.pop();
                } else {
                    this.updateEndOfList({ state: payload.state, value: true });
                }
                if (payload.state === config().quizState.published) {
                    this.getQuizzesPublishedSuccess({ value: data, isLoadMore: payload.isLoadMore });
                } else if (payload.state === config().quizState.draft) {
                    this.getQuizzesDraftSuccess({ value: data, isLoadMore: payload.isLoadMore });
                } else if (payload.state === config().quizState.removed) {
                    this.getQuizzesRemovedSuccess({ value: data, isLoadMore: payload.isLoadMore });
                }
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
            } finally {
                !payload.isLoadMore
                    ? this.updateBusyState(false)
                    : this.updateLoadingMoreState(false);
            }
        },
        async getQuizzesBeacon(payload: { uuid: string, minor: number, major: number }, rootState: AppState): Promise<any> {
            try {
                // this.updateBusyState(true);
                const result: any = await serviceProvider.ApiService().getAllQuizzes(
                    rootState.userProfile.token,
                    '',
                    config().quizState.published,
                    '',
                    100,
                    'createdAt',
                    true,
                    true,
                    payload.uuid,
                    payload.major,
                    payload.minor,
                );
                console.log(result);
                const data = result.data.map((item: any, index: number) => {
                    return {
                        ...item,
                        coverImageUrl: `${config().hostUrl}${config().imageUrl}${item.coverImageUrl}`
                    };
                });
                this.getQuizzesBeaconSuccess({ value: data, isLoadMore: false });

            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
            } finally {
                // this.updateBusyState(false);
            }
        },
        async findQuizzes(payload: { value: string, isLoadMore: boolean, state: string }, rootState: AppState): Promise<any> {
            try {
                // this.updateBusyState(true);
                !payload.isLoadMore
                    ? this.updateBusyState(true)
                    : this.updateLoadingMoreState(true);
                const length = rootState.quizzes.allQuizzesSearched.length;
                const pageIndex = payload.isLoadMore
                    ? length === 0
                        ? ''
                        : rootState.quizzes.allQuizzesSearched[length - 1].createdAt
                    : '';

                const result: any = await serviceProvider.ApiService().getAllQuizzes(
                    rootState.userProfile.token,
                    payload.value,
                    payload.state,
                    pageIndex,
                    30,
                    'createdAt',
                    true,
                    false,
                    '',
                    0,
                    0,
                );
                const data = result.data.map((item: any, index: number) => {
                    return {
                        ...item,
                    };
                });
                if (data.length === 51) {
                    data.pop();
                } else {
                    this.updateEndOfList({ state: config().quizState.searched, value: true });
                }
                this.getQuizzesSearchedSuccess({ value: data, isLoadMore: payload.isLoadMore });

            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
            } finally {
                !payload.isLoadMore
                    ? this.updateBusyState(false)
                    : this.updateLoadingMoreState(false);
            }
        },
        async createQuiz(payload: CreateQuizParams, rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                const body = {
                    coverImageUrl: rootState.quizzes.quizToCreate.coverImageUrl,
                    title: rootState.quizzes.quizToCreate.title,
                    description: rootState.quizzes.quizToCreate.description,
                    state: rootState.quizzes.quizToCreate.state,
                    beacon: {
                        isActive: rootState.quizzes.quizToCreate.beacon.isActive,
                        uuid: rootState.quizzes.quizToCreate.beacon.uuid,
                        major: rootState.quizzes.quizToCreate.beacon.major,
                        minor: rootState.quizzes.quizToCreate.beacon.minor
                    },
                    questions: rootState.quizzes.questionToCreate
                };
                const result = await serviceProvider.ApiService().createQuiz(
                    rootState.userProfile.token,
                    body
                );
                this.addQuiz(result);
                this.resetQuizToCreate();
                this.updateCurrentRoute(ScreenNames.ManageQuizzes);
                serviceProvider.NavigatorService().navigate(ScreenNames.ManageQuizzes);
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
                Toast.show({
                    text: 'Something wrong! Please try again later',
                    buttonText: 'Okay',
                    type: 'danger'
                });
            } finally {
                this.updateBusyState(false);
            }
        },
        async updateQuiz(payload: UpdateQuizParams, rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                const body = {
                    coverImageUrl: rootState.quizzes.quizToCreate.coverImageUrl,
                    title: rootState.quizzes.quizToCreate.title,
                    description: rootState.quizzes.quizToCreate.description,
                    state: rootState.quizzes.quizToCreate.state,
                    beacon: {
                        isActive: rootState.quizzes.quizToCreate.beacon.isActive,
                        uuid: rootState.quizzes.quizToCreate.beacon.uuid,
                        major: rootState.quizzes.quizToCreate.beacon.major,
                        minor: rootState.quizzes.quizToCreate.beacon.minor
                    },
                    questions: rootState.quizzes.questionToCreate
                };
                const result = await serviceProvider.ApiService().updateQuiz(
                    rootState.userProfile.token,
                    rootState.quizzes.quizToCreate._id,
                    body
                );
                // const newAllQuizzesPublished = rootState.quizzes.allQuizzesPublished.slice().map((item: G) => item.st);
                this.getAllQuizzes({ state: payload.currentState, isLoadMore: false });
                this.resetQuizToCreate();
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
                Toast.show({
                    text: 'Something wrong! Please try again later',
                    buttonText: 'Okay',
                    type: 'danger'
                });
            } finally {
                this.updateBusyState(false);
            }
        },
        async getQuizById(payload: { id: string, isForCreate: boolean }, rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                const result: any = await serviceProvider.ApiService().findQuizz(
                    rootState.userProfile.token,
                    payload.id
                );
                if (payload.isForCreate) {
                    this.addQuestionToCreate(result.questions);
                    this.updateQuizToCreate({
                        title: result.title,
                        description: result.description,
                        state: result.state,
                        isActive: result.beacon.isActive,
                        uuid: result.beacon.uuid,
                        major: result.beacon.major,
                        minor: result.beacon.minor,
                        _id: result._id,
                    });
                    const questionChecklist: QuestionChecklist = {
                        isHavingCoverUrl: result.questions.map((item: any) => item.coverUrl === '' ? false : true),
                        isHavingQuestion: result.questions.map((item: any) => item.description === '' ? false : true),
                    };
                    this.updateQuestionChecklist(questionChecklist);
                } else {
                    const data = {
                        ...result,
                    };
                    this.updateQuizIsPlaying(data);
                }
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
                Toast.show({
                    text: 'Something wrong! Please try again later',
                    buttonText: 'Okay',
                    type: 'danger'
                });
            } finally {
                this.updateBusyState(false);
            }
        },
        async deleteQuiz(payload: { id: string, index: number, state: string }, rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                const result: any = await serviceProvider.ApiService().deleteQuiz(
                    rootState.userProfile.token,
                    payload.id
                );
                this.deleteQuizSuccess({ index: payload.index, state: payload.state });
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
                Toast.show({
                    text: 'Something wrong! Please try again later',
                    buttonText: 'Okay',
                    type: 'danger'
                });
            } finally {
                this.updateBusyState(false);
            }
        },
        async submitAnswer(payload: string, rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                const body = {
                    userId: rootState.userProfile._id,
                    quizId: rootState.quizzes.quizIsPlaying._id,
                    answers: rootState.quizzes.questionAnswer
                };
                const result: any = await serviceProvider.ApiService().submitQuizAnswers(
                    rootState.userProfile.token,
                    body
                );
                this.resetQuestionAnswer();
                this.updateQuestionResult(result);
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
                Toast.show({
                    text: 'Something wrong! Please try again later',
                    buttonText: 'Okay',
                    type: 'danger'
                });
            } finally {
                this.updateBusyState(false);
            }
        },
        async activateQuiz(payload: string, rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                const result: any = await serviceProvider.ApiService().activateQuiz(
                    rootState.userProfile.token,
                    payload
                );
                Toast.show({
                    text: 'Restore successfully! Your quiz is now on draft state',
                    buttonText: 'Okay',
                    type: 'success'
                });
                this.restoreQuizSuccess(payload);
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
                Toast.show({
                    text: 'Something wrong! Please try again later',
                    buttonText: 'Okay',
                    type: 'danger'
                });
            } finally {
                this.updateBusyState(false);
            }
        },
        async uploadImage(payload: { uri: string, isQuestionCoverUrl: boolean, index?: number, }, rootState: AppState): Promise<any> {
            try {
                this.updateIsUploadingState(true);
                const body = new FormData();
                body.append('tempimage', { uri: payload.uri, name: 'photo.png', filename: 'imageName.png', type: 'image/png' });
                body.append('Content-Type', 'image/png');
                const result: any = await fetch('https://lumileds.techkids.io/api/uploadImage', {
                    method: 'POST', headers: {
                        'Content-Type': 'multipart/form-data',
                        token: rootState.userProfile.token
                    },
                    body
                });
                const coverUrl = JSON.parse(result._bodyText).filepath;
                if (payload.isQuestionCoverUrl) {
                    this.updateCoverUrlQuestion({ coverUrl, index: payload.index });
                } else {
                    this.updateQuizToCreate({ coverImageUrl: coverUrl });
                }
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
                Toast.show({
                    text: 'Something wrong! Please try again later',
                    buttonText: 'Okay',
                    type: 'danger'
                });
            } finally {
                this.updateIsUploadingState(false);
            }
        },
    }),
});

export default navigation;

