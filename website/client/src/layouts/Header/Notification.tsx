import * as React from 'react';
import { Popover, Badge, Icon } from 'antd';
import { NotiContent } from './NotiContent';
import './Notification.less';

export class Notification extends React.Component {
  render (): JSX.Element {
    return (
      <Popover
        content={<NotiContent />}
        placement='bottomRight'
        trigger='click'
        arrowPointAtCenter={true}
      >
        <span className='notification-button'>
          <Badge count={22} className='notification-button-badge'>
            <Icon type='bell' className='notification-button-icon' />
          </Badge>
        </span>
      </Popover>
    );
  }
}
