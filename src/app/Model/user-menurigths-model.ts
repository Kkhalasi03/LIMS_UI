export interface UserMenurigthsModel {
    UserMenuId?: number; // Optional for cases where it's not needed
    UserId: number;
    MenuId: number[];
    HasAccess: boolean[];
}
