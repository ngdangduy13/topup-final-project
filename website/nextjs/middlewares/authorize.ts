import * as jwtDecode from 'jwt-decode';
import { ITokenData } from '../../api/modules/auth/auth/interface';
import logger from '../../api/core/logger/log4js';
import authService from '../../api/modules/auth/auth/service';
import config from '../../configs';
const Authorize = (requiredPermission: string[] = [], isClient = false) => {
  return async (req: any, res: any, next: any) => {
    const loginUrl = `${req.protocol}://${req.get('host')}/admin/login${isClient ? '?callbackUrl=' + req.url : ''}`;
    if (!req.headers.token && !req.cookies.token) {
      if (isClient) {
        res.redirect(loginUrl);
      } else {
        res.status(401).end('Unauthorized');
      }
      return next();
    }
    let token = !req.headers.token ? req.cookies.token : req.headers.token;
    let tokenData: ITokenData = {} as any;

    try {
      // Refresh Token
      token = await authService.refreshToken(token);
      tokenData = jwtDecode(token);
    } catch (error) {
      logger.error(`Token Expired Or Invalid`);
      if (isClient) {
        res.redirect(loginUrl);
      } else {
        res.status(401).end('Unauthorized');
      }
      return next();
    }

    // Verify Permissions
    if (!requiredPermission || requiredPermission.length <= 0 ||
      (tokenData.roles && requiredPermission && requiredPermission.length > 0 &&
        (tokenData.roles.filter((role: string) => requiredPermission.filter((requiredPermit: string) => role.trim() === requiredPermit.trim()).length > 0).length > 0))) {
      req.query.profile = {
        ...tokenData,
        token,
      };

      res.cookie(`token`, token, {
        domain: config.nextjs.cookieDomain,
        maxAge: (tokenData.exp! - tokenData.iat! >= config.auth.expiresIn_7days) ? config.auth.expiresIn_7days * 1000 : config.auth.expiresIn_1day * 1000,
      });
    } else if (!tokenData.roles ||
      (tokenData.roles.filter((role: string) => requiredPermission.filter((requiredPermit: string) => role.trim() === requiredPermit.trim()).length > 0).length <= 0)) {
      if (isClient) {
        res.redirect(loginUrl);
      } else {
        res.status(401).end('Unauthorized');
      }
    }

    return next();
  };
};

export default Authorize;
