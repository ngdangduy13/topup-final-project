import * as React from 'react';
import { List, Avatar } from 'antd';
import './NotiList.less';

export class NotiList extends React.Component {
  data: any[] = [
    {
      title: 'Notification Number 1',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ...',
      datetime: '2018/04/01',
    },
    {
      title: 'Notification Number 2',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ...',
      datetime: '2018/04/01',
    },
    {
      title: 'Notification Number 3',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ...',
      datetime: '2018/04/01',
    },
    {
      title: 'Notification Number 4',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ...',
      datetime: '2018/04/01',
    },
    {
      title: 'Notification Number 5',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ...',
      datetime: '2018/04/01',
    },
    {
      title: 'Notification Number 6',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ...',
      datetime: '2018/04/01',
    },
    {
      title: 'Notification Number 7',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ...',
      datetime: '2018/04/01',
    },
    {
      title: 'Notification Number 8',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ...',
      datetime: '2018/04/01',
    },
  ];

  render (): JSX.Element {
    return (
      <List
        className='noti-list'
        dataSource={this.data}
        renderItem={(item: any) => (
          <List.Item className='noti-list-item'>
            <List.Item.Meta
              className='noti-list-item-meta'
              avatar={
                <Avatar className='noti-list-item-meta-avatar' icon='user' />
              }
              title={
                <div className='noti-list-item-meta-title'>
                  <span>{item.title}</span>
                </div>
              }
              description={
                <div>
                  <div className='noti-list-item-meta-description'>
                    {item.description}
                  </div>
                  <div className='noti-list-item-meta-description-datetime'>
                    {item.datetime}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  }
}
