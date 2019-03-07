import { PageableQuery } from '../interfaces';
import * as _ from 'lodash';
import config from '../../../configs';

const validatePagination = <T extends PageableQuery>(query: T) => {
  const pageIndex = query.pageIndex;
  const pageSize = query.pageSize
    ? _.parseInt(query.pageSize.toString())
    : config.app.defaultPageSize;
  return {
    ...(query as any),
    pageSize,
    pageIndex,
  } as T;
};

export default validatePagination;
