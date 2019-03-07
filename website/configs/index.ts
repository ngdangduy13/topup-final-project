import defaultConfig from './default.config';
import usersModuleConfig from './modules/users.config';
import developmentConfig from './development.config';
import productionConfig from './production.config';
import firebaseConfig from './firebase.config';
import exceptionConfig from './exception.config';
import awsConfig from './aws';
import * as _ from 'lodash';

const environmentConfig =
  process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;
const config = _.merge(
  {},
  defaultConfig,
  usersModuleConfig,
  environmentConfig,
  firebaseConfig,
  awsConfig,
  exceptionConfig,
);
export default config;