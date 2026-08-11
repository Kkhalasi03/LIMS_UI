export interface TestResult {
    TestId: number;
    ResultValue: string;  // Matches the 'ResultValue' in DB
    ServiceStatus: string; // Matches 'ServiceStatus' in DB, nullable string to match nullable char in C#

}
