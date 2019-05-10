
import { createModel } from '@rematch/core';
import { ScoreboardState, ScoreboardItem } from './interface';
import serviceProvider from '../../../services/service.provider';
import { AppState } from '../../state';

const defaultState: ScoreboardState = {
    scoreboard: [],
    quizScoreboard: []
};

const navigation = createModel({
    state: defaultState, // initial state
    reducers: {
        updateBusyState: (payload: any) => {
            return {
                ...payload
            };
        },
        getScoreboardSuccess: (state: ScoreboardState, payload: ScoreboardItem[]) => {
            return {
                ...state,
                scoreboard: payload,
            };
        },
        getQuizScoreboardSuccess: (state: ScoreboardState, payload: ScoreboardItem[]) => {
            return {
                ...state,
                quizScoreboard: payload,
            };
        },
    },
    effects: (_dispatch) => ({
        async getScoreboard(payload: string, rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                const result: any = await serviceProvider.ApiService().getScoreboard(
                    rootState.userProfile.token,
                    payload,
                    '',
                    50,
                    'points',
                    true
                );
                const scoreboard = result.data.map((item: any) => ({
                    ...item,
                    isCurrentUser: item.userId === rootState.userProfile._id
                }));
                if (payload === '') {
                    this.getScoreboardSuccess(scoreboard);
                } else {
                    this.getQuizScoreboardSuccess(scoreboard);
                }

            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
            } finally {
                this.updateBusyState(false);
            }
        },
        async getQuizScoreboard(payload: string, rootState: AppState): Promise<any> {
            try {
                this.updateBusyState(true);
                const result: any = await serviceProvider.ApiService().getQuizScoreboard(
                    rootState.userProfile.token,
                    payload,
                    rootState.userProfile._id,
                    '',
                    50,
                );
                const scoreboard = result.data.map((item: any) => ({
                    ...item,
                    isCurrentUser: item.userId === rootState.userProfile._id
                }));
                this.getQuizScoreboardSuccess(scoreboard);
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
            } finally {
                this.updateBusyState(false);
            }
        },
    }),
});

export default navigation;
