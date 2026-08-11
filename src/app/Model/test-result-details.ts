import { ServiceTestMapping } from "./service-test-mapping";

export interface TestResultDetails {
    TestResultId: number;
    SampleRegisterId: number;
    ServiceTests: ServiceTestMapping[];
    ValidateBy: string;
    ValidateOn: Date | null;  // Date or null to match nullable DateTime in C#
    CreatedBy: string;
    CreatedOn: Date;  // Date type for DateTime in C#
    isActive: boolean | null;  // Nullable boolean   
}
