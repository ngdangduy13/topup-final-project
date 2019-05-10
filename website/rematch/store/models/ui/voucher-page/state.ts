// import { IFindVoucherResult } from '../../../../../api/modules/voucher/interface';

export interface VoucherPageState {
  listVoucher: any;
  // currentVoucher: SingleVoucher;

  voucherListPageIndex: string;
  voucherListPageOrientation: boolean;
  pageSize: number;
  sortBy: string;

  isVoucherListNextDisabled: boolean;
  isVoucherListPrevDisabled: boolean;
  voucherListFirstPage: boolean;

  isBusy: boolean;
  errorMessage: string;
}

export interface SingleVoucher {
  _id: string;
  coverUrl: string;
  name: string;
  description: string;
  pointForExchange: number;
}
