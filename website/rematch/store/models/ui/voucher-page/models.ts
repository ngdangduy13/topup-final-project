import { ModelConfig, createModel } from '@rematch/core';
import { VoucherPageState } from './state';
import { IErrorPayload } from '../user-page/state';
import { message } from 'antd';
import { AppState } from '../../../state';

const initialState = {
  listVoucher: { data: [], total: 0 },

  voucherListPageIndex: '',
  voucherListPageOrientation: true,
  pageSize: 10,
  sortBy: '',

  isVoucherListNextDisabled: false,
  isVoucherListPrevDisabled: true,
  voucherListFirstPage: true,

  isBusy: false,
  errorMessage: '',
};

const voucherPageModel: ModelConfig<VoucherPageState> = createModel({
  state: initialState,
  reducers: {
    onLoading: (state: VoucherPageState): VoucherPageState => {
      return {
        ...state,
        isBusy: true,
      };
    },
    onDone: (state: VoucherPageState): VoucherPageState => {
      return {
        ...state,
        isBusy: false,
      };
    },

    onError: (state: VoucherPageState, payload: IErrorPayload): VoucherPageState => {
      return {
        ...state,
        isBusy: false,
        errorMessage: payload.errorMessage,
      };
    },
    setOrientationButtonVisibility: (state: VoucherPageState, payload: any): VoucherPageState => {
      return {
        ...state,
        ...payload,
      };
    },
    fetchListVoucherSuccessfully: (state: VoucherPageState, payload: any): VoucherPageState => {
      return {
        ...state,
        isBusy: false,
        listVoucher: payload,
      };
    },
    setPageIndex: (state: VoucherPageState, payload: any): VoucherPageState => {
      return {
        ...state,
        ...payload,
      };
    },
    setPageOrientation: (state: VoucherPageState, payload: any): VoucherPageState => {
      return {
        ...state,
        ...payload,
      };
    },
    setFirstPageCheck: (state: VoucherPageState, payload: any): VoucherPageState => {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    async fetchListVoucher(_payload: any, rootState: AppState): Promise<void> {
      try {
        this.onLoading();
        console.log(rootState.profileModel.token);
        const body = {
          searchTerm: '',
          pageIndex: rootState.voucherPageModels.voucherListPageIndex,
          pageSize: rootState.voucherPageModels.pageSize,
          pageOrientation: rootState.voucherPageModels.voucherListPageOrientation,
          sortBy: 'createdAt',
        };
        const fetchData = await fetch(
          `http://localhost:3003/api/voucher?searchTerm=${body.searchTerm}&pageIndex=${
            body.pageIndex
          }&pageSize=${body.pageSize}&pageOrientation=${body.pageOrientation}&sortBy=${
            body.sortBy
          }`,
          {
            // method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              token: rootState.profileModel.token,
            },
            // body: JSON.stringify(body),
          }
        );
        const result = await fetchData.json();
        console.log(result);
        if (rootState.voucherPageModels.voucherListPageOrientation) {
          this.setOrientationButtonVisibility({
            isVoucherListNextDisabled:
              result && (result as any).data && (result as any).data.length < 11,
          });

          this.setOrientationButtonVisibility({
            isVoucherListPrevDisabled: rootState.voucherPageModels.voucherListFirstPage,
          });
        } else {
          this.setOrientationButtonVisibility({
            isVoucherListPrevDisabled:
              result && (result as any).data && (result as any).data.length < 11,
          });
          this.setOrientationButtonVisibility({
            isVoucherListNextDisabled: false,
          });
        }
        if (result && (result as any).data && (result as any).data.length > 10) {
          (result as any).data.splice(
            rootState.voucherPageModels.voucherListPageOrientation ? 10 : 0,
            1
          );
        }
        this.fetchListVoucherSuccessfully(result);
      } catch (error) {
        this.onError({ errorMessage: error.message });
        // message.error(error.message, 3);
      }
    },
    // async findQuizzById(payload: any, rootState: any): Promise<void> {
    //   try {
    //     this.onLoading();
    //     const service = new ServiceProxy();
    //     const quizResult = await service.findQuizz(rootState.profileModel.token, payload.id);
    //     this.findQuizzSuccessfully(quizResult);
    //   } catch (error) {
    //     this.onError({ errorMessage: error.message });
    //     // message.error(error.message, 3);
    //   }
    // },
    async createNewVoucher(payload: any, rootState: AppState): Promise<void> {
      try {
        this.onLoading();
        const body = {
          coverUrl: payload.coverUrl,
          name: payload.name,
          description: payload.description,
          pointForExchange: payload.point,
        };
        await fetch(
          `http://localhost:3003/api/voucher`,
          {
            method: 'POST',
            headers: {
              // Accept: 'application/json',
              'Content-Type': 'application/json',
              token: rootState.profileModel.token,
            },
            body: JSON.stringify(body),
          }
        );
        message.success('Add new voucher successfully', 3000);
        this.fetchListVoucher();
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

export default voucherPageModel;
