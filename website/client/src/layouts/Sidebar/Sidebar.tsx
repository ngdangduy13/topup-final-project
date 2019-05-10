import * as React from 'react';
import { Menu, Icon } from 'antd';
// import Logo from '../Logo/Logo';
// import SmallLogo from '../SmallLogo/SmallLogo';
import './Sidebar.less';
// import { MainPageState, openKeyChange } from '../../redux/ui/main-page';
// import { AppState } from '../../redux';
// import { connect } from 'react-redux';
// import { Dispatch } from 'redux';

import sidebarMenu from '../../constants/sidebar.constant';
import Router from 'next/router';
import { RematchRootState, RematchDispatch } from '@rematch/core';
import withRematch from '../../../common/hocs/withRematch';
import { initStore, models } from '../../../../rematch/store';
import { IProfileState } from '../../../../rematch/store/models/profile/interface';
// import { checkOnePermission, checkAllPermissions } from '../../helpers';
// import { I18nextProviderProps } from 'react-i18next/src/I18nextProvider';
// import { TranslationFunction, translate } from 'react-i18next';

interface SidebarProps {
  // isSidebarCollapsed: boolean;
  // openKeys: string[];
  profile: IProfileState;
  // dispatch: Dispatch<any>;
  // t: TranslationFunction;
}

class Sidebar extends React.Component<SidebarProps, any> {
  // handleOpenChange = (openKeys: string[]) => {
  //   // this.props.dispatch(openKeyChange(openKeys));
  // };

  checkRole = (requireRoles: string[], roles: string[]) => {
    let flag = false;
    for (const role of roles) {
      if (requireRoles.indexOf(role) !== -1) {
        flag = true;
      }
    }
    return flag;
  };

  renderSubmenu = (submenu: any) => {
    if (
      // true // checkOnePermission(submenu.permissions, this.props.profile.permissions)
      this.checkRole(submenu.role, this.props.profile.roles)
    ) {
      if (!submenu.isExpandable) {
        return (
          <Menu.Item key={`${submenu.key}`} className="submenu-item">
            <span>
              <Icon type={submenu.icon} />
              <span>{submenu.title}</span>
            </span>
          </Menu.Item>
        );
      }
      return (
        <Menu.SubMenu
          key={submenu.key}
          title={
            <span>
              <Icon type={submenu.icon} />
              <span>{submenu.title}</span>
            </span>
          }
          className="submenu"
        >
          {submenu.items.map((item: any) => this.renderMenuItem(item))}
        </Menu.SubMenu>
      );
    } else {
      return;
    }
  };

  renderMenuItem = (menuitem: any) => {
    if (
      true // checkAllPermissions(menuitem.permissions, this.props.profile.permissions)
    ) {
      return (
        <Menu.Item key={`${menuitem.key}`}>
          <span>{menuitem.title}</span>
        </Menu.Item>
      );
    } else {
      return;
    }
  };
  handleClick = (e: any) => {
    console.log('click ', e);
    Router.push(e.key);
  };

  render(): JSX.Element {
    // const openKeys = this.props.isSidebarCollapsed
    //   ? {}
    //   : { openKeys: this.props.openKeys };

    return (
      <div className="sidebar-menu">
        {/* {this.props.isSidebarCollapsed ? <SmallLogo /> : <Logo />} */}
        <Menu
          onClick={this.handleClick}
          key="Menu"
          theme="dark"
          mode="inline"
          // {...openKeys}
          // onOpenChange={this.handleOpenChange}
          // selectedKeys={[this.props.history.location.pathname]}
          style={{
            padding: '16px 0',
            width: '100%',
            position: 'relative',
          }}
        >
          {sidebarMenu.map(submenu => this.renderSubmenu(submenu))}
        </Menu>
      </div>
    );
  }
}
// const mapStateToProps = (state: AppState) => ({
//   mainPage: state.ui.mainPage,
//   profile: state.profile,
// });

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

export default withRematch(initStore, mapStateToProps, mapDispatchToProps)(Sidebar);
