export interface PaymentModeModel {
    PaymentModeId:number;
    PaymentModeName:string;
    isCash:boolean|null;
    isCheque:boolean|null;
    isOnlinePayment:boolean|null;
    isActive:boolean|null;
}
