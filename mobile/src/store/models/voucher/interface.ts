export interface VoucherState {
    all: VoucherItem[];
    selectedVoucher: VoucherItem;
    isBusy: boolean;
    isVisible: boolean;

}

export interface VoucherItem {
    name: string;
    description: string;
    pointForExchange: number;
    coverUrl: string;
    _id: string;
    code: string
}
