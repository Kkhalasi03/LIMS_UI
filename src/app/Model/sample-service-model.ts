export interface SampleServiceModel {
    SampleRegisterId: number;
    ServiceId: number[];  // Array of integers representing the list of ServiceIds
    Amount:number[];
    Status?: string;
}
