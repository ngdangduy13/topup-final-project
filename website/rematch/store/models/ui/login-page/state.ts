export interface LoginPageState {
    email: string;
    password: string;
    rememberMe: boolean;

    isBusy: boolean;
    errorMessage: string;
}

export interface LoginPayload {
    usernameOrEmail: string;
    password: string;
    rememberMe: boolean;
    isMobile: boolean;
}

export interface OnErrorPayload {
    errorMessage: string;
}
