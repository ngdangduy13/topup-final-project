import React from 'react';
import { Animated, View, Text, Image, FlatList, TouchableOpacity, InteractionManager, Keyboard, DeviceEventEmitter, Modal } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { AppState } from '../../store/state';
import { models } from '../../store';
import BasicLayout from '../../components/BasicLayout';
import moment from 'moment';
import styles from './styles';
import config from '../../config';
import { Card, CardItem, Body, Spinner } from 'native-base';
import ScreenNames from '../screen-names';
import { translate } from 'react-i18next';
import TextMontserrat from '../../components/TextMontserrat';
import FastImage from 'react-native-fast-image';
import { SharedElement } from 'react-native-motion';
import { SingleQuiz, GeneralQuiz, EndList } from '../../store/models/quizzes/interface';
import Svg, {
    Circle,
    Rect,
} from 'react-native-svg';
import ContentLoader from 'rn-content-loader';
import { getLayout } from '../../helpers/get-layout';
import Icon from 'react-native-vector-icons/Ionicons';
import { UserInfo } from '../../store/models/user-profile/interface';
import Beacons from 'react-native-beacons-manager';
import ModalWarning from '../../components/ModalWarning';

export interface Props extends NavigationScreenProps {
    updateCurrentRoute: (name: string) => void;
    updateQuizIsPlaying: (quiz: SingleQuiz) => void;
    getQuizById: (id: string, isForCreate: boolean) => void;
    getAllQuizzes: (state: string, isLoadMore: boolean) => void;
    getQuizzesBeacon: (uuid: string, major: number, minor: number) => void;
    removeQuizzesBeacon: () => void;
    quizzes: GeneralQuiz[];
    isBusy: boolean;
    currentRoute: string;
    userProfile: UserInfo;
    isLoadingMore: boolean;
    endOfList: EndList;
    allQuizzesBeacon: GeneralQuiz[];
}
export interface State {
    isRanging: boolean;
    isRequested: boolean;
}

const region: any = {
    identifier: 'iBeacon',
    // uuid: '6405b82f-01ba-4447-8787-b22c599cda2d',
    uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
    major: 10001,
    minor: 19641
};

class DatePicker extends React.Component<Props, State> {

    static navigationOptions: any = ({ navigation }: { navigation: any }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Discovery',
            headerLeft: (
                <TouchableOpacity onPress={params.openUserProfile} style={styles.AvatarContainer}>
                    <FastImage source={(params.profileImgUrl !== '' && params.profileImgUrl !== undefined)
                        ? { uri: `${config().hostUrl}${config().imageUrl}${params.profileImgUrl}` }
                        : require('../../../assets/images/avatar.png')}
                        style={styles.Avatar} />
                </TouchableOpacity>
            ),
            headerRight: (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={params.isRanging ? params.stopRangingIos : params.startRangingIos}
                        style={{ marginRight: 12, flex: 1, padding: 10, }}>
                        <Icon name="ios-pulse" size={25} color={params.isRanging ? '#E9E906' : '#fff'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={params.openSearchQuest} style={{ marginRight: 12, flex: 1, padding: 10, }}>
                        <Icon name="ios-search" size={25} color="#fff" />
                    </TouchableOpacity>
                </View>
            )
        };
    };
    timeout: any;
    timeoutBeacon: any;
    beaconsDidRangeEvent: any;

    constructor(props: any) {
        super(props);
        this.state = {
            isRanging: false,
            isRequested: false,
        };
    }

    componentWillMount(): void {
        InteractionManager.runAfterInteractions(() => {
            if (this.props.currentRoute !== ScreenNames.Discovery) {
                this.props.updateCurrentRoute(ScreenNames.Discovery);
                this.props.getAllQuizzes(config().quizState.published, false);
            }
            this.props.navigation.setParams({
                openUserProfile: this.openUserProfile,
                profileImgUrl: this.props.userProfile.profileImgUrl,
                openSearchQuest: this.openSearchQuest,
                startRangingIos: this.startRangingIos,
                stopRangingIos: this.stopRangingIos
            });
            Keyboard.dismiss();
        });
    }

    stopRangingIos = () => {
        this.setState(
            {
                isRanging: false,
                isRequested: false,
            },
            () => {
                this.props.navigation.setParams({ isRanging: false });
                Beacons.stopRangingBeaconsInRegion(region);
                this.beaconsDidRangeEvent.remove();
                setTimeout(this.props.removeQuizzesBeacon, 1000);
            }
        );
    }

    startRangingIos = () => {
        this.setState(
            {
                isRanging: true
            },
            () => {
                this.props.navigation.setParams({ isRanging: true });
                (Beacons as any).requestWhenInUseAuthorization();
                // Beacons.startMonitoringForRegion(region);
                Beacons.startRangingBeaconsInRegion(region);
                // (Beacons as any).startUpdatingLocation();
                this.beaconsDidRangeEvent = DeviceEventEmitter.addListener(
                    'beaconsDidRange',
                    (data: any) => {
                        console.log(data);
                        // console.log(data);
                        if (data.beacons !== undefined
                            && data.beacons.length !== 0
                            && data.beacons[0].proximity !== 'unknown'
                        ) {
                            clearTimeout(this.timeoutBeacon);
                            if (!this.state.isRequested) {
                                this.props.getQuizzesBeacon(region.uuid, region.major, region.minor);
                            }
                            this.setState(
                                {
                                    isRequested: true
                                },
                            );
                        } else {
                            this.timeoutBeacon = setTimeout(
                                () => this.setState(
                                    {
                                        isRequested: false
                                    },
                                    () => this.props.removeQuizzesBeacon()
                                ),
                                2000
                            );
                        }
                    }
                );
            }
        );
    }

    onReachEndFlatlist = (wait: number) => {
        if (!this.props.isLoadingMore && !this.props.endOfList.PUBLISHED) {
            const executeFunction = () => {
                this.props.getAllQuizzes(config().quizState.published, true);
            };

            clearTimeout(this.timeout);
            this.timeout = setTimeout(executeFunction, wait);
        }
    };

    openSearchQuest = () => {
        this.props.updateCurrentRoute(ScreenNames.SearchQuest);
        this.props.navigation.navigate(ScreenNames.SearchQuest);
    }

    openUserProfile = () => {
        this.props.updateCurrentRoute(ScreenNames.UserProfile);
        this.props.navigation.navigate(ScreenNames.UserProfile);
    }

    renderQuestionBoard = ({ item, index }: { item: GeneralQuiz, index: number }) => {
        const onPress = () => {
            this.props.updateCurrentRoute(ScreenNames.QuestDetail);
            this.props.navigation.navigate(ScreenNames.QuestDetail);
            this.props.getQuizById(item._id, false);
        };
        return (
            <TouchableOpacity
                style={styles.ImageContainer}
                key={index}
                onPress={onPress}>
                <View>
                    <FastImage source={item.coverImageUrl === ''
                        ? require('../../../assets/images/background.jpg')
                        : { uri: item.coverImageUrl }} style={styles.Image} borderRadius={2} />
                    <View style={styles.CountContainer}>
                        <TextMontserrat style={{ color: '#fff', fontFamily: 'Montserrat-ExtraBold', fontSize: 12 }}>
                            {item.questionCount} Questions
                        </TextMontserrat>
                    </View>
                </View>
                <View style={{ paddingVertical: 12, paddingHorizontal: 18, backgroundColor: '#fff', borderRadius: 5 }}>
                    <TextMontserrat style={styles.TitleText}>{item.title}</TextMontserrat>
                    <TextMontserrat style={{ color: '#B8B8B8', fontSize: 12, }}>
                        Created At: {moment((item as any).createAt).format('MMM Do YYYY')}
                    </TextMontserrat>
                </View>
            </TouchableOpacity>
        );
    }

    renderFooterFlatlist = () => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                {this.props.endOfList.PUBLISHED
                    ? <TextMontserrat>Out of quizzes</TextMontserrat>
                    : this.props.isLoadingMore && <Spinner color={config().primaryColor} />}
            </View>
        );
    }

    onPressBeaconQuiz = () => {
        this.props.updateCurrentRoute(ScreenNames.QuestDetail);
        this.props.navigation.navigate(ScreenNames.QuestDetail);
        this.props.getQuizById(this.props.allQuizzesBeacon[0]._id, false);
        this.stopRangingIos();
    }

    render(): React.ReactNode {
        return (
            <BasicLayout styles={{ backgroundColor: '#FAFAFA' }}>
                <View style={{ paddingTop: 12, justifyContent: 'center', alignItems: 'center', }}>
                    {this.props.isBusy
                        ? <ContentLoader
                            rtl
                            height={160}
                            width={getLayout().deviceWidth}
                            speed={3}
                            primaryColor="#f3f3f3"
                            secondaryColor="#ecebeb"
                            style={{ backgroundColor: '#fff' }}
                        >
                            <Rect x="5.39" y="3.61" rx="3" ry="3" width={getLayout().deviceWidth - 20} height="150" />
                            <Rect x="5.39" y="183.67" rx="3" ry="3" width="150" height="7.42" />
                            <Rect x="5.39" y="165.88" rx="3" ry="3" width="315.2" height="8.83" />
                        </ContentLoader>
                        : <FlatList
                            data={this.props.quizzes}
                            renderItem={this.renderQuestionBoard}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            style={{ width: '94%', marginBottom: 8 }}
                            onEndReachedThreshold={0}
                            onScroll={() => this.onReachEndFlatlist(200)}
                            ListFooterComponent={this.renderFooterFlatlist}
                        // bounces={false}
                        />
                    }
                </View>
                {this.props.allQuizzesBeacon.length !== 0 &&
                    <Modal
                        animationType="fade"
                        visible={this.state.isRequested}
                        transparent={true}>
                        <ModalWarning
                            title="Find you a quiz!"
                            content={
                                <TouchableOpacity
                                    style={styles.ImageContainer}
                                    onPress={this.onPressBeaconQuiz}
                                >
                                    <View>
                                        <FastImage source={this.props.allQuizzesBeacon[0].coverImageUrl === ''
                                            ? require('../../../assets/images/background.jpg')
                                            : { uri: this.props.allQuizzesBeacon[0].coverImageUrl }} style={styles.Image} borderRadius={2} />
                                        <View style={styles.CountContainer}>
                                            <TextMontserrat style={{ color: '#fff', fontFamily: 'Montserrat-ExtraBold', fontSize: 12 }}>
                                                {this.props.allQuizzesBeacon[0].questionCount} Questions
                                    </TextMontserrat>
                                        </View>
                                    </View>
                                    <View style={{ paddingVertical: 12, paddingHorizontal: 18, backgroundColor: '#fff', borderRadius: 5 }}>
                                        <TextMontserrat style={styles.TitleText}>{this.props.allQuizzesBeacon[0].title}</TextMontserrat>
                                        <TextMontserrat style={{ color: '#B8B8B8', fontSize: 12, }}>
                                            Created At: {moment((this.props.allQuizzesBeacon[0] as any).createAt).format('MMM Do YYYY')}
                                        </TextMontserrat>
                                    </View>
                                </TouchableOpacity>
                            }
                            onBlur={this.stopRangingIos}
                            noButton />
                    </Modal>}
            </BasicLayout >
        );
    }
}
const mapState = (state: AppState) => ({
    currentRoute: state.navigation.currentRoute,
    quizzes: state.quizzes.allQuizzesPublished,
    isBusy: state.appState.isBusy,
    userProfile: state.userProfile,
    isLoadingMore: state.appState.isLoadingMore,
    endOfList: state.quizzes.endOfList,
    allQuizzesBeacon: state.quizzes.allQuizzesBeacon
});

const mapDispatch = ({ navigation, quizzes }: RematchDispatch<models>) => ({
    updateCurrentRoute: (name: string) => { navigation.updateCurrentRoute(name as any); },
    getAllQuizzes: (state: string, isLoadMore: boolean) => { quizzes.getAllQuizzes({ state, isLoadMore } as any); },
    updateQuizIsPlaying: (quiz: SingleQuiz) => { quizzes.updateQuizIsPlaying(quiz as any); },
    getQuizById: (id: string, isForCreate: boolean) => { quizzes.getQuizById({ id, isForCreate } as any); },
    getQuizzesBeacon: (uuid: string, major: number, minor: number) => quizzes.getQuizzesBeacon({ uuid, major, minor } as any),
    removeQuizzesBeacon: () => { quizzes.removeQuizzesBeacon('' as any); },
});

export default connect(mapState, mapDispatch as any)(translate()(DatePicker));
