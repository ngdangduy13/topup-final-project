import * as React from 'react';
import { Menu, Icon, Dropdown, Avatar } from 'antd';
// import { Notification } from './Notification';
import './Header.less';
import withRematch from '../../../common/hocs/withRematch';
import { RematchRootState, RematchDispatch } from '@rematch/core';
import { models, initStore } from '../../../../rematch/store';
import { IProfileState } from '../../../../rematch/store/models/profile/interface';
import Router from 'next/router';
import config from '../../../../configs';
// import { connect } from 'react-redux';
// import { Dispatch } from 'redux';
// import { AppState } from '../../redux/state';
// import { push } from 'react-router-redux';
// import { RouteUrls } from '../../routes/routes.constant';
// import { logout } from '../../redux/profile/action';
// import { ProfileState } from '../../redux/profile';
// import { ProfilePageState } from '../../redux/ui/profile-page';
// import { AppSettingsState } from '../../redux/app-settings';
// import { MainPageState, toggleSidebar } from '../../redux/ui/main-page';
// import { I18nextProviderProps } from 'react-i18next/src/I18nextProvider';
// import { TranslationFunction, translate } from 'react-i18next';

// tslint:disable-next-line:no-empty-interface
interface HeaderProps {
  // profile: ProfileState;
  // profilePage: ProfilePageState;
  // appSettings: AppSettingsState;
  // mainPage: MainPageState;
  // dispatch: Dispatch<any>;
  // t: TranslationFunction;
  // isSidebarCollapsed: boolean;
  profile: IProfileState;
  logOut: () => void;
}

class Header extends React.Component<HeaderProps> {
  constructor(props: Readonly<HeaderProps>) {
    super(props);
  }
  renderMenuItem() {
    return (
      <Menu className='user-menu' selectedKeys={[]}>
        {/* <Menu.Item>
          <Link to='/main/profile' className='user-menu-item'>
            <Icon type='user' className='user-menu-item-icon' />
            {props.t('Header.profile')}
          </Link>
          <Icon type='user' className='user-menu-item-icon' />
          Profile
        </Menu.Item>

        <Menu.Item>
          <Icon type='setting' className='user-menu-item-icon' />
          {props.t('Header.settings')}
          Settings
        </Menu.Item>

        <Menu.Item key='triggerError'>
          <Icon type='close-circle' className='user-menu-item-icon' />
          {props.t('Header.report')}
          Report
        </Menu.Item>

        <Menu.Divider /> */}

        <Menu.Item key='logout'>
          <div onClick={() => {
            this.props.logOut();
            Router.push('/admin/login');
          }}>
            <Icon type='logout' className='user-menu-item-icon' />
            {/* {props.t('Header.logout')} */}
            Logout
          </div>
        </Menu.Item>
      </Menu>
    );
  }

  toggleCollapsed() {
    this.setState({
      // isSidebarCollapsed : !this.props.isSidebarCollapsed,
    });
  }

  render(): JSX.Element {
    return (
      <div className='header'>
        {/* <Icon
          className='trigger'
          type={
            this.props.isSidebarCollapsed ?
              'menu-unfold' :
              'menu-fold'
          }
          onClick={() => this.toggleCollapsed()}
        /> */}

        <div className='header-right'>
          {/* <CustomSearch {...this.props} />

          <LanguagePicker /> */}

          {/* <div className='notification'>
            <Notification />
          </div> */}

          <Dropdown overlay={this.renderMenuItem()}>
            <span className='avatar'>
              <Avatar className='avatar-image'
                src={this.props.profile.profileImgUrl !== undefined && this.props.profile.profileImgUrl !== '' ?
                  `${config.nextjs.hostUrl}${config.imageUrl.temp}${this.props.profile.profileImgUrl}` : ''}
              />
              <span className='avatar-name'>{this.props.profile.username}</span>
            </span>
          </Dropdown>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (rootState: RematchRootState<models>) => {
  return {
    profile: rootState.profileModel,
  };
};

const mapDispatchToProps = (rootReducer: RematchDispatch<models>) => {
  return {
    ...rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapStateToProps, mapDispatchToProps)(Header);
