import { createModel } from "@rematch/core";
import { VoucherState } from "./interface";
import serviceProvider from "../../../services/service.provider";
import { AppState } from "../../state";
import { Toast } from "native-base";

const defaultState: VoucherState = {
  all: [],
  selectedVoucher: {
    name: "",
    description: "",
    pointForExchange: 0,
    coverUrl: "",
    _id: ""
  },
  isBusy: false,
  isVisible: false,
};

const navigation = createModel({
  state: defaultState, // initial state
  reducers: {
    updateBusyState: (payload: any) => {
      return {
        ...payload
      };
    },
    getVoucherSuccess: (state: VoucherState, payload: any) => {
      return {
        ...state,
        all: payload
      };
    },
    setSelectedVoucher: (state: VoucherState, payload: any) => {
      return {
        ...state,
        selectedVoucher: payload
      };
    },
    exchangeSuccessfully: (state: VoucherState, payload: any) => {
        return {
          ...state,
          isVisible: payload
        };
      },
  },
  effects: dispatch => ({
    async getVoucher(payload: string, rootState: AppState): Promise<any> {
      try {
        this.updateBusyState(true);
        const fetchData = await fetch(
          `http://localhost:3003/api/voucher?searchTerm=&pageIndex=0&pageSize=50&pageOrientation=&sortBy=createdAt}`,
          {
            // method: 'GET',
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              token: rootState.userProfile.token
            }
            // body: JSON.stringify(body),
          }
        );
        const result = await fetchData.json();
        console.log(result);
        this.getVoucherSuccess(result.data);
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
      } finally {
        this.updateBusyState(false);
      }
    },
    async exchangeVoucher(payload: any, rootState: AppState): Promise<any> {
      try {
        this.updateBusyState(true);

        if(rootState.userProfile.rewardPoint < rootState.voucher.selectedVoucher.pointForExchange){
            Toast.show({
                text: 'You don\'t have enough points to exchange',
                type: 'danger'
            });
            return;
        }

        const body = {
          userId: rootState.userProfile._id,
          points: rootState.voucher.selectedVoucher.pointForExchange,
          reason: rootState.voucher.selectedVoucher.name
        };
        const fetchData = await fetch(
          `http://localhost:3003/api/users/${
            rootState.userProfile._id
          }/redeempoints`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              token: rootState.userProfile.token
            },
            body: JSON.stringify(body)
          }
        );
        const result = await fetchData.json();
        dispatch.userProfile.updateRewardPoint(-rootState.voucher.selectedVoucher.pointForExchange);
        this.exchangeSuccessfully(true);
        // console.log(result);
        // this.getVoucherSuccess(result.data);
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
      } finally {
        this.updateBusyState(false);
      }
    }
  })
});

export default navigation;
