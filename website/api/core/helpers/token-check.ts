import { ITokenData } from '../../modules/auth/auth/interface';
import * as jwtDecode from 'jwt-decode';
import authService from '../../modules/auth/auth/service';
const isTokenValid = async (token: string, requiredPermission: string): Promise<boolean> => {
    let tokenData: ITokenData = {} as any;
    try {
        // Refresh Token
        token = await authService.refreshToken(token);
        tokenData = jwtDecode(token);
    } catch (error) {
        return false;
    }
    if (!requiredPermission) {
        return true;
    }
    if ((!tokenData.roles || tokenData.roles.indexOf(requiredPermission) === -1)) {
        return false;
    }
    return true;
};
export default isTokenValid;
