import { Component } from 'react';
import { Layout } from 'antd';
import SideBar from './Sidebar/Sidebar';
import Header from './Header/Header';
// import Footer from './Footer/Footer';
// import withRematch from '../../common/hocs/withRematch';
// import { RematchDispatch, RematchRootState } from '@rematch/core';
import './index.less';
// import { AppSettingsState } from '../../../rematch/store/models/app-setting/state';
// import { models, initStore } from '../../../rematch/store';
// tslint:disable-next-line:no-empty-interface
export interface AdminLayoutProps {
    // isSidebarCollapsed: boolean;
    // openKeys: string[];
    // appSetting: AppSettingsState;
}

class AdminLayout extends Component<any> {
    constructor(props: Readonly<AdminLayoutProps>) {
        super(props);
        this.state = {
            isSidebarCollapsed: false,
        };
    }
    render(): JSX.Element {
        return (
            <div
                className='main-page'>
                <Layout>
                    <Layout.Sider
                        trigger={undefined}
                        collapsible={true}
                        collapsed={false}
                        breakpoint='lg'
                        width={288}
                        className='sider'
                    >
                        <SideBar {...this.props} />
                    </Layout.Sider>

                    <Layout>
                        <Layout.Header style={{ padding: 0 }}>
                            <Header />
                        </Layout.Header>

                        <Layout.Content>
                            {/* <PageHeader {...this.props} /> */}
                            {this.props.children}
                        </Layout.Content>

                        {/* <Layout.Footer style={{ padding: 0 }}>
                            <Footer />
                        </Layout.Footer> */}
                    </Layout>
                </Layout>
            </div>
        );
    }
}

// const mapStateToProps = (_rootState: RematchRootState<models>) => ({
//     appSetting: _rootState.appSettings,
// });
// const mapDispatchToProps = (_reducer: RematchDispatch<models>) => ({

// });

export default AdminLayout;
