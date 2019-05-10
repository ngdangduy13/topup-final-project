import defaultConfig from './default.config';
import usersConfig from './modules/users.config';
import exceptionConfig from './exception.config';

const config = { ...defaultConfig, ...usersConfig, ...exceptionConfig };
export default config;
