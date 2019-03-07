import * as React from 'react';
import { Breadcrumb } from 'antd';
import './PageHeader.less';
// import { translate, TranslationFunction } from 'react-i18next';
// import { I18nextProviderProps } from 'react-i18next/src/I18nextProvider';

// tslint:disable-next-line:no-empty-interface
interface PageHeaderProps {
  // t: TranslationFunction;
}

const PageHeader = (_props: PageHeaderProps) => {
  return (
    <div className='page-header'>
      <div className='breadcrumb'>
        <Breadcrumb>
          {/* {props.location.pathname
            .split('/')
            .map((item) => (
              <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
            ))} */}
        </Breadcrumb>
      </div>
    </div>
  );
};

export default PageHeader;
