import * as React from 'react';
import { Tabs } from 'antd';
import { NotiList } from './NotiList';
import './NotiContent.less';

export class NotiContent extends React.Component {
  render (): JSX.Element {
    return (
      <Tabs className='noti-content'>
        <Tabs.TabPane tab='Tab Number 1' key='1'>
          <NotiList />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Tab Number 2' key='2'>
          <NotiList />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Tab Number 3' key='3'>
          <NotiList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
