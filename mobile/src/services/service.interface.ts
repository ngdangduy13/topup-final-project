
export interface LoginParams {
    email: string;
    password: string;
}
type QuizzState = 'DRAFT' | 'PUBLISHED' | 'REMOVED';

export interface RegisterParams {
    username: string;
    password: string;
    email: string;
    fullname: string;
}
