import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Animated, View, TouchableOpacity, Easing } from 'react-native';
import { Root } from 'native-base';
import serviceProvider from '../services/service.provider';
import ScreenNames from '../screens/screen-names';
import {
	Login, Register, ResetPassword, Discovery, Scoreboard,
	ManageQuizzes, CreateQuiz, CreateQuizQuestion, QuestionAnswer,
	SearchQuest,
	EmailSent,
	RegisterSuccess,
	QuestDetail,
	VideoTutorial,
	QuizResult,
	QuizScoreboard,
	ResetPassFirstStep,
	BeaconManager,
	Voucher,
	VoucherDetail
} from '../screens';
import { AppState } from '../store/state';
import { RematchDispatch } from '@rematch/core';
import { models } from '../store';
import { connect } from 'react-redux';
import FooterTab from '../components/FooterTab';
import config from '../config';
import Icon from 'react-native-vector-icons/Ionicons';
import UserProfile from '../screens/UserProfile';
import { UserInfo } from '../store/models/user-profile/interface';

export interface AppNavigatorProps {
	avatarUrl: string;
	currentRoute: string;
	updateCurrentRoute: (name: string) => void;
	userProfile: UserInfo;
}

const transitionConfig = () => {
	return {
		transitionSpec: {
			duration: 500,
			easing: Easing.out(Easing.poly(4)),
			timing: Animated.timing,
			useNativeDriver: true,
		},
		screenInterpolator: (sceneProps: any) => {
			// console.log(sceneProps);
			const { layout, position, scene } = sceneProps;

			const thisSceneIndex = scene.index;
			const width = layout.initWidth;

			const translateX = position.interpolate({
				inputRange: [thisSceneIndex - 1, thisSceneIndex],
				outputRange: [width, 0],
			});

			return { transform: [{ translateX }] };
		},
	};
};

class AppNavigator extends React.Component<AppNavigatorProps, any> {
	App: any = createStackNavigator(
		{
			[ScreenNames.Discovery]: { screen: Discovery },
			[ScreenNames.Scoreboard]: { screen: Scoreboard },
			[ScreenNames.ManageQuizzes]: { screen: ManageQuizzes },
			[ScreenNames.CreateQuiz]: { screen: CreateQuiz },
			[ScreenNames.CreateQuizQuestion]: { screen: CreateQuizQuestion },
			[ScreenNames.QuestionAnswer]: { screen: QuestionAnswer },
			[ScreenNames.UserProfile]: { screen: UserProfile },
			[ScreenNames.SearchQuest]: { screen: SearchQuest },
			[ScreenNames.VideoTutorial]: { screen: VideoTutorial },
			[ScreenNames.QuestDetail]: { screen: QuestDetail },
			[ScreenNames.QuizResult]: { screen: QuizResult },
			[ScreenNames.Voucher]: { screen: Voucher },
			[ScreenNames.QuizScoreboard]: { screen: QuizScoreboard },
			[ScreenNames.VoucherDetail]: { screen: VoucherDetail },
		},
		{
			initialRouteName: ScreenNames.Discovery,
			transitionConfig,
			navigationOptions: {
				headerStyle: {
					backgroundColor: config().primaryColor,
					height: 60,
					borderBottomWidth: 0,
				},
				headerLeft: (
					<View></View>
				),
				headerRight: (
					<View></View>
				),
				headerTitleStyle: {
					color: '#fff',
					fontFamily: 'Montserrat-Regular',
					alignSelf: 'center',
					textAlign: 'center',
					flex: 1
				},
			}
		}
	);

	Auth: any = createStackNavigator(
		{
			[ScreenNames.Login]: { screen: Login },
			[ScreenNames.Register]: { screen: Register },
			[ScreenNames.ResetPassword]: { screen: ResetPassword },
			[ScreenNames.EmailSent]: { screen: EmailSent },
			[ScreenNames.RegisterSuccess]: { screen: RegisterSuccess },
			[ScreenNames.ResetPassFirstStep]: { screen: ResetPassFirstStep },
		},
		{
			initialRouteName: ScreenNames.Login,
			headerMode: 'none'
		}
	);

	Stack: any = createStackNavigator(
		{
			[ScreenNames.App]: { screen: this.App },
			[ScreenNames.Auth]: { screen: this.Auth },
		},
		{
			initialRouteName: this.props.userProfile.isLoggedIn ? ScreenNames.App : ScreenNames.Auth,
			// initialRouteName: ScreenNames.App,
			headerMode: 'none'
		}
	);

	visibleFooterScreen: any[] = [
		ScreenNames.Discovery,
		ScreenNames.Scoreboard,
		ScreenNames.Voucher,
	];
	constructor(props: any) {
		super(props);
		this.state = {
		};
	}

	render(): React.ReactNode {
		return (
			<Root style={{ position: 'relative' }}>
				<this.Stack ref={(navigatorRef: any) => {
					serviceProvider.NavigatorService().setContainer(navigatorRef);
				}}
				/>
				{
					this.visibleFooterScreen.indexOf(this.props.currentRoute) !== -1 && <FooterTab />
				}
			</Root>
		);
	}
}

const mapState = (state: AppState) => ({
	currentRoute: state.navigation.currentRoute,
	userProfile: state.userProfile
});

const mapDispatch = ({ navigation, userProfile }: RematchDispatch<models>) => ({
	updateCurrentRoute: (name: string) => { navigation.updateCurrentRoute(name as any); },
});

export default connect(mapState, mapDispatch as any)(AppNavigator);
