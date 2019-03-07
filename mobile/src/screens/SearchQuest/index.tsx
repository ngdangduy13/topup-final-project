import { View, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import { Card, CardItem, Text, Body, Left, Spinner, Input, Item } from 'native-base';
import styles from './styles';
import BasicLayout from '../../components/BasicLayout';
import serviceProvider from '../../services/service.provider';
import { NavigationActions, NavigationScreenProps } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppState } from '../../store/state';
import { RematchDispatch } from '@rematch/core';
import { models } from '../../store';
import { connect } from 'react-redux';
import ScreenNames from '../screen-names';
import TextMontserrat from '../../components/TextMontserrat';
import { GeneralQuiz, EndList } from '../../store/models/quizzes/interface';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import config from '../../config';

export interface SearchQuestProps extends NavigationScreenProps {
    updateCurrentRoute: (name: string) => void;
    resetQuizzesSearched: () => void;
    getQuizById: (id: string, isForCreate: boolean) => void;
    findQuizzes: (value: string, isLoadMore: boolean, state: string) => void;
    allQuizzesSearched: GeneralQuiz[];
    isBusy: boolean;
    isLoadingMore: boolean;
    endOfList: EndList;
}

export interface State {
    pageIndex: number;
    onTimeout: boolean;
    searchText: string;
}

class SearchQuest extends React.Component<SearchQuestProps, State> {
    // tslint:disable-next-line:no-shadowed-variable
    static navigationOptions: any = ({ navigation }: { navigation: any }) => {
        const { params = {} } = navigation.state;
        return {
            headerLeft: (
                <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => params.onBack()}>
                    <Icon name="md-arrow-back" size={26} color="#fff" />
                </TouchableOpacity >
            ),
            headerTitle: (
                // <View style={styles.SearchSeaction}>
                //     <Icon style={{ paddingLeft: 10 }} name="ios-search" size={20} color="#000" />
                //     <TextInput
                //         onChangeText={(text) => params.onChangeTextDelayed(text, 200)}
                //         style={styles.TextInputContainer}
                //         placeholder="Search"
                //         placeholderTextColor="gray" />

                // </View>
                <Item rounded style={{ backgroundColor: '#fff', height: 40, width: '100%' }}>
                    <Input
                        placeholder="Search"
                        onChangeText={(text) => params.onChangeTextDelayed(text, 500)}
                        style={{ fontFamily: 'Montserrat-Regular', fontSize: 14, marginLeft: 4 }} />
                </Item>
            ),
            headerRight: (
                <View></View>
            )
        };
    };
    timeout: any;
    timeoutForLoadingMore: any;

    constructor(props: any) {
        super(props);

        this.props.navigation.setParams({
            onBack: this.onBack,
            onChangeTextDelayed: this.onChangeTextDelayed
        });
        this.state = {
            pageIndex: 1,
            onTimeout: false,
            searchText: ''
        };
    }

    onBack = () => {
        this.props.resetQuizzesSearched();
        this.props.updateCurrentRoute(ScreenNames.Discovery);
        serviceProvider.NavigatorService().navigate(ScreenNames.Discovery);
    }

    onChangeTextDelayed = (searchText: string, wait: number) => {
        const executeFunction = () => {
            this.setState(
                {
                    searchText
                },
                () => this.props.findQuizzes(searchText, false, config().quizState.published)
            );
        };

        clearTimeout(this.timeout);
        this.timeout = setTimeout(executeFunction, wait);
    };

    onReachEndFlatlist = (wait: number) => {
        if (!this.props.isLoadingMore && !this.props.endOfList.SEARCHED) {
            const executeFunction = () => {
                this.props.findQuizzes(this.state.searchText, true, config().quizState.published);
            };

            clearTimeout(this.timeoutForLoadingMore);
            this.timeoutForLoadingMore = setTimeout(executeFunction, wait);
        }
    };

    renderFooterFlatlist = () => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                {this.props.endOfList.SEARCHED
                    ? <TextMontserrat>Out of quizzes</TextMontserrat>
                    : this.props.isLoadingMore && <Spinner color={config().primaryColor} />}
            </View>
        );
    }

    renderQuestionBoard = ({ item, index }: { item: GeneralQuiz, index: number }) => {
        const onDetail = () => {
            this.props.updateCurrentRoute(ScreenNames.QuestDetail);
            this.props.navigation.navigate(ScreenNames.QuestDetail);
            this.props.getQuizById(item._id, false);
        };
        return (
            <TouchableOpacity style={styles.ImageContainer} onPress={onDetail} key={index}>
                <View style={{ width: '35%', height: '100%' }}>
                    <FastImage source={item.coverImageUrl === ''
                        ? require('../../../assets/images/background.jpg')
                        : { uri: item.coverImageUrl }} style={styles.Image} borderRadius={2} />
                    <View style={styles.CountContainer}>
                        <TextMontserrat style={{ color: '#fff', fontFamily: 'Montserrat-ExtraBold', fontSize: 12 }}>
                            {item.questionCount} Qs
                    </TextMontserrat>
                    </View>
                </View>
                <View style={{ paddingVertical: 4, width: '65%', paddingHorizontal: 8, backgroundColor: '#fff', borderRadius: 5 }}>
                    <TextMontserrat style={styles.TitleText} numberOfLines={1}>{item.title}</TextMontserrat>
                    <TextMontserrat style={{ paddingBottom: 12, fontSize: 12, color: '#B8B8B8' }}>
                        Created At: {moment((item as any).createAt).format('MMM Do YYYY')}
                    </TextMontserrat>
                </View>
            </TouchableOpacity>
        );
    }
    render(): JSX.Element {
        return (
            <BasicLayout>
                <View style={{ paddingHorizontal: 8, paddingTop: 12, alignItems: 'center', flex: 1 }}>
                    {this.props.isBusy
                        ? <Spinner color={config().primaryColor} />
                        : <FlatList
                            style={{ width: '100%', flexGrow: 0, marginBottom: 10 }}
                            data={this.props.allQuizzesSearched}
                            renderItem={this.renderQuestionBoard}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReachedThreshold={0}
                            onScroll={() => this.onReachEndFlatlist(200)}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={this.renderFooterFlatlist}
                        // bounces={false}

                        />}
                </View>
            </BasicLayout>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    allQuizzesSearched: state.quizzes.allQuizzesSearched,
    isBusy: state.appState.isBusy,
    isLoadingMore: state.appState.isLoadingMore,
    endOfList: state.quizzes.endOfList
});

const mapDispatchToProps = ({ navigation, quizzes }: RematchDispatch<models>) => ({
    updateCurrentRoute: (name: string) => navigation.updateCurrentRoute(name as any),
    getQuizById: (id: string, isForCreate: boolean) => { quizzes.getQuizById({ id, isForCreate } as any); },
    resetQuizzesSearched: () => { quizzes.getQuizzesSearchedSuccess({ value: [], isLoadMore: false } as any); },
    findQuizzes: (value: string, isLoadMore: boolean, state: string) => {
        quizzes.findQuizzes({ value, isLoadMore, state } as any);
    },
});

export default connect(mapStateToProps, mapDispatchToProps as any)(SearchQuest);
