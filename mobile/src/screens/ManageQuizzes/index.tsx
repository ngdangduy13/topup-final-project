import React from 'react';
import { Animated, View, Text, Image, FlatList, TouchableOpacity, Modal } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { AppState } from '../../store/state';
import { models } from '../../store';
import BasicLayout from '../../components/BasicLayout';
import moment from 'moment';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenNames from '../screen-names';
import { Card, CardItem, Body, Left, Tabs, Tab } from 'native-base';
import TextMontserrat from '../../components/TextMontserrat';
import config from '../../config';
import { GeneralQuiz, EndList } from '../../store/models/quizzes/interface';
import Svg, {
    Circle,
    Rect,
} from 'react-native-svg';
import ContentLoader from 'rn-content-loader';
import { getLayout } from '../../helpers/get-layout';
import ModalChildren from '../../components/ModalWarning';
import TabChild from './TabChild';

export interface Props extends NavigationScreenProps {
    updateCurrentRoute: (name: string) => void;
    getQuizById: (id: string, isForCreate: boolean) => void;
    deleteQuiz: (payload: { id: string, index: number }) => void;
    findQuizzes: (value: string, pageIndex: number, isLoadMore: boolean, state: string) => void;
    getAllQuizzes: (state: string, isLoadMore: boolean) => void;
    activateQuiz: (value: string) => void;
    resetQuizzesSearched: () => void;
    allQuizzesPublished: GeneralQuiz[];
    allQuizzesDraft: GeneralQuiz[];
    allQuizzesSearched: GeneralQuiz[];
    allQuizzesRemoved: GeneralQuiz[];
    isBusy: boolean;
    isLoadingMore: boolean;
    endOfList: EndList;
}
export interface State {
    activeState: number;
    isDeleting: boolean;
    itemForDeleting: { id: string, index: number };
}

interface TopBarItem {
    id: number;
    name: string;
    icon: string;
}

const topBarItems: TopBarItem[] = [
    { id: 0, name: config().quizState.published, icon: 'md-star' },
    { id: 1, name: config().quizState.draft, icon: 'ios-cube' },
    { id: 2, name: config().quizState.removed, icon: 'md-trash' }
];

class DatePicker extends React.Component<Props, State> {
    static navigationOptions: any = ({ navigation }: { navigation: any }) => ({
        title: 'Manage Quizz',
        headerStyle: {
            backgroundColor: config().primaryColor,
            height: 60,
            borderBottomWidth: 0,
            elevation: 0,
            shadowColor: 'transparent',
        },
        headerLeft: (
            <View></View>
        ),
        headerRight: (
            <View></View>
        ),
    });

    constructor(props: any) {
        super(props);
        this.state = {
            activeState: 0,
            isDeleting: false,
            itemForDeleting: {
                id: '',
                index: 0,
            },
        };
    }

    onBack = () => {
        this.props.resetQuizzesSearched();
        this.props.updateCurrentRoute(ScreenNames.Discovery);
        this.props.navigation.navigate(ScreenNames.Discovery);
    }

    onCreate = () => {
        this.props.updateCurrentRoute(ScreenNames.CreateQuiz);
        this.props.navigation.navigate(ScreenNames.CreateQuiz, { currentState: topBarItems[this.state.activeState].name });
    }

    onDelete = () => {
        this.props.deleteQuiz(this.state.itemForDeleting);
        this.setState(
            {
                isDeleting: false,
                itemForDeleting: {
                    id: '',
                    index: 0
                }
            }
        );
    }

    render(): React.ReactNode {

        return (
            <BasicLayout styles={{ backgroundColor: '#FAFAFA' }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Tabs
                        page={this.state.activeState}
                        renderTabBar={() =>
                            <View style={styles.TopBar}>
                                {topBarItems.map((item: TopBarItem, index: number) => {
                                    const onPress = () => {
                                        this.setState(
                                            {
                                                activeState: item.id
                                            },
                                            () => this.props.getAllQuizzes(item.name, false)
                                        );
                                    };
                                    return (
                                        <TouchableOpacity style={styles.TopBarItem} onPress={onPress} key={index}>
                                            <View style={this.state.activeState === item.id
                                                ? { ...styles.CircleIcon }
                                                : { ...styles.CircleIcon, backgroundColor: config().primaryColor }}>
                                                <Icon name={item.icon} size={20} color={
                                                    this.state.activeState === item.id
                                                        ? config().primaryColor
                                                        : '#fff'}
                                                    style={{ marginHorizontal: 8 }} />
                                            </View>
                                            <TextMontserrat style={this.state.activeState === item.id
                                                ? { ...styles.TopBarText, fontFamily: 'Montserrat-SemiBold', }
                                                : { ...styles.TopBarText }}>{item.name}</TextMontserrat>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        }>
                        {[this.props.allQuizzesPublished,
                        this.props.allQuizzesDraft,
                        this.props.allQuizzesRemoved].map((item: GeneralQuiz[], index) => {
                            return (
                                <Tab heading={index.toString()} key={index}>
                                    <TabChild
                                        updateCurrentRoute={this.props.updateCurrentRoute}
                                        getQuizById={this.props.getQuizById}
                                        deleteQuiz={this.props.deleteQuiz}
                                        isBusy={this.props.isBusy}
                                        data={item}
                                        navigation={this.props.navigation}
                                        quizState={topBarItems[index].name}
                                        findQuizzes={this.props.findQuizzes}
                                        dataSearch={this.props.allQuizzesSearched}
                                        activateQuiz={this.props.activateQuiz}
                                        getAllQuizzes={this.props.getAllQuizzes}
                                        isLoadingMore={this.props.isLoadingMore}
                                        endOfList={this.props.endOfList}
                                    />
                                </Tab>
                            );
                        })}
                    </Tabs>
                    <View style={styles.Footer}>
                        <TouchableOpacity style={styles.CircleBack} onPress={this.onBack}>
                            <Icon name="ios-arrow-back" size={17} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.CreateButton} onPress={this.onCreate}>
                            <Text style={{ fontFamily: 'Montserrat-ExtraBold', color: '#fff', fontSize: 17 }}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BasicLayout >
        );
    }
}
const mapState = (state: AppState) => ({
    allQuizzesPublished: state.quizzes.allQuizzesPublished,
    allQuizzesDraft: state.quizzes.allQuizzesDraft,
    allQuizzesRemoved: state.quizzes.allQuizzesRemoved,
    allQuizzesSearched: state.quizzes.allQuizzesSearched,
    isBusy: state.appState.isBusy,
    isLoadingMore: state.appState.isLoadingMore,
    endOfList: state.quizzes.endOfList
});

const mapDispatch = ({ navigation, quizzes }: RematchDispatch<models>) => ({
    updateCurrentRoute: (name: string) => { navigation.updateCurrentRoute(name as any); },
    getQuizById: (id: string, isForCreate: boolean) => { quizzes.getQuizById({ id, isForCreate } as any); },
    deleteQuiz: (payload: { id: string, index: number }) => { quizzes.deleteQuiz(payload as any); },
    resetQuizzesSearched: () => { quizzes.getQuizzesSearchedSuccess({ value: [], isLoadMore: false } as any); },
    getAllQuizzes: (state: string, isLoadMore: boolean) => { quizzes.getAllQuizzes({ state, isLoadMore } as any); },
    findQuizzes: (value: string, pageIndex: number, isLoadMore: boolean, state: string) => {
        quizzes.findQuizzes({ value, pageIndex, isLoadMore, state } as any);
    },
    activateQuiz: (value: string) => {
        quizzes.activateQuiz(value as any);
    },
});

export default connect(mapState, mapDispatch as any)(DatePicker);
