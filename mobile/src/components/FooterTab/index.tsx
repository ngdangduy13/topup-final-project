import { Footer, FooterTab, Button } from 'native-base';
import * as React from 'react';
import { Text, View, Modal } from 'react-native';
import serviceProvider from '../../services/service.provider';
import { connect } from 'react-redux';
import ScreenNames from '../../screens/screen-names';
import { AppState } from '../../store/state';
import { RematchDispatch } from '@rematch/core';
import { models } from '../../store';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../../config';
import TextMontserrat from '../TextMontserrat';
import { UserInfo } from '../../store/models/user-profile/interface';

export interface Props {
    currentRoute: string;
    userProfile: UserInfo;
    updateCurrentRoute: (name: string) => void;
}

export interface State {
    isVisibleTimer: boolean;
}

interface MenuItem {
    routeName: string;
    icon: string;
    text: string;
}

class FooterApp extends React.Component<Props, State> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            isVisibleTimer: false,
        };
    }

    renderMenuItem = (menuItem: MenuItem, index: number) => {
        const currentRoute: string = this.props.currentRoute;
        const onPress = () => {
            serviceProvider.NavigatorService().navigate(menuItem.routeName);
            this.props.updateCurrentRoute(menuItem.routeName);
        };
        return (
            <View
                style={{
                    flex: 1,
                }}
                key={index}>
                <Button
                    full
                    onPress={onPress}
                    transparent
                >
                    <Icon name={menuItem.icon} size={25} style={currentRoute === menuItem.routeName ? {
                        color: config().primaryColor,
                    } : {
                            color: '#636363',
                        }} />
                    <TextMontserrat
                        style={{
                            fontSize: 12,
                            color: currentRoute === menuItem.routeName ? config().primaryColor : '#969696',
                            fontFamily: 'Montserrat-SemiBold',
                        }}>
                        {menuItem.text}
                    </TextMontserrat>
                </Button>
            </View>
        );
    }

    render(): React.ReactNode {
        let isQuizMaster: boolean = false;
        if (this.props.userProfile.roles.length > 0) {
            for (const role of this.props.userProfile.roles) {
                if (role === 'QUIZZ_MASTER') {
                    isQuizMaster = true;
                }
            }
        }

        const menuItems: MenuItem[] = isQuizMaster
            ? [
                {
                    routeName: ScreenNames.Discovery,
                    icon: 'ios-compass',
                    text: 'Discovery'
                },
                {
                    routeName: ScreenNames.ManageQuizzes,
                    icon: 'ios-cog',
                    text: 'Management'
                },
                {
                    routeName: ScreenNames.Scoreboard,
                    icon: 'ios-podium',
                    text: 'Scoreboard'
                },
                {
                    routeName: ScreenNames.Voucher,
                    icon: 'ios-gift',
                    text: 'Voucher'
                }
            ]
            : [
                {
                    routeName: ScreenNames.Discovery,
                    icon: 'ios-compass',
                    text: 'Discovery'
                },
                {
                    routeName: ScreenNames.Scoreboard,
                    icon: 'ios-podium',
                    text: 'Scoreboard'
                },
                {
                    routeName: ScreenNames.Voucher,
                    icon: 'ios-gift',
                    text: 'Voucher'
                }
            ];
        return (
            <View>
                <Footer>
                    <FooterTab style={{ backgroundColor: '#fff', zIndex: 5 }}>
                        {menuItems.map(this.renderMenuItem)}
                    </FooterTab>
                </Footer >
            </View>

        );
    }
}

const mapStateToProps = (state: AppState) => ({
    currentRoute: state.navigation.currentRoute,
    userProfile: state.userProfile
});

const mapDispatchToProps = ({ navigation }: RematchDispatch<models>) => ({
    updateCurrentRoute: (name: string) => { navigation.updateCurrentRoute(name as any); },
});

export default connect(mapStateToProps, mapDispatchToProps as any)(FooterApp);
