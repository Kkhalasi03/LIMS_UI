export interface SampleRegisterModel {
    SampleRegisterId: number;
    BranchId:number;
    B2BId:number;
    MobileNo?: string;      // Optional field (can be null or undefined)
    Title?: string;         // Optional field (can be null or undefined)
    FirstName?: string;     // Optional field (can be null or undefined)
    MiddleName?: string;    // Optional field (can be null or undefined)
    LastName?: string;      // Optional field (can be null or undefined)
    DOB?: string;           // Optional field (Date can be string or Date object)
    Age: number;
    Gender?: string;        // Optional field (can be null or undefined)
    EmailId?: string;       // Optional field (can be null or undefined)
    Address?: string;       // Optional field (can be null or undefined)
    CityId: number;
    AreaId: number;
    isActive: boolean| null;     // Optional field (can be null or undefined)
    TotalAmount:number;
    CreatedBy?:string;
    CreatedOn?:Date;
    Status?: string;
}
