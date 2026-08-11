export interface SamplePaymentDetails {
  SamplePaymentId: number;
  SampleRegisterId: number;
  PaymentModeId: number;
  AmountPaid: number;
  TransactionNo?: string; 
  DateOfTransaction?:string; 
  ChequeNo?: string | null;
  CardNo?: string | null; 
}
