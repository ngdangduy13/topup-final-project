export interface UserInfo {
    email: string;
    fullName: string;
    username: string;
    _id: string;
    isLoggedIn: boolean;
    token: string;
    scorePoint: number;
    rewardPoint: number;
    profileImgUrl: string;
    roles: string[];
}

export interface ResetPasswordParams {
    email: string;
    password: string;
    token: string;
}

export interface UpdateUserParams {
    profileImgUrl?: string;
    fullName?: string;
}
