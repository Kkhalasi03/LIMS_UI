export interface RegisterModel {
    UserId: number;
    FullName: string;
    UserName: string;
    Password: string;
    EmailId: string;
    MobileNo: string;
    BirthDay: string; // Using string format (ISO 8601) since TypeScript lacks DateOnly
    Gender: string;
    isActive: boolean|null;
    UserType: string;
    SignatureFile?: File | null; // For uploading the signature image
    Signature?: Uint8Array | null; // For handling the byte array if needed
}
