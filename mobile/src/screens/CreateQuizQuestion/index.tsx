import React from 'react';
import { Animated, View, Text, Image, TouchableOpacity, FlatList, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { AppState } from '../../store/state';
import { models } from '../../store';
import BasicLayout from '../../components/BasicLayout';
import moment from 'moment';
import styles from './styles';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, CardItem, Body, Item, Input, Badge, Left, Tabs, Tab, ScrollableTab } from 'native-base';
import config from '../../config';
import ScreenNames from '../screen-names';
import Checklist from './Checklist';
import TextMontserrat from '../../components/TextMontserrat';
import FastImage from 'react-native-fast-image';
import { Transition } from 'react-navigation-fluid-transitions';
import TabChild from './TabChild';
import { Question, QuestionChecklist } from '../../store/models/quizzes/interface';
import { getLayout } from '../../helpers/get-layout';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export interface Props extends NavigationScreenProps {
    updateCurrentRoute: (name: string) => void;
    questionsToCreate: Question[];
    questionChecklist: QuestionChecklist;
    isUploadingImage: boolean;
    addNewQuestion: () => void;
    updateTitleQuestion: (title: string, index: number) => void;
    updateAnswer: (indexQuestion: number, indexAnswer: number, answer: string) => void;
    updateIsCorrect: (indexQuestion: number, indexAnswer: number) => void;
    uploadImage: (uri: any, isQuestionCoverUrl: boolean, index?: number) => void;
    updateIsHavingCoverUrl: (index: number, value: boolean) => void;
    updateIsHavingQuestion: (index: number, value: boolean) => void;
}
export interface State {
    isOpenChecklist: boolean;
    page: number;
}

class CreatQuizQuestion extends React.Component<Props, State> {
    static navigationOptions: any = ({ navigation }: { navigation: any }) => {
        const { params = {} } = navigation.state;
        return {
            headerTitle: (
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => params.onPressChecklist()}>
                        <TextMontserrat style={styles.HeaderText}>Question {params.page + 1}</TextMontserrat>
                        <Icon name="ios-alert" size={25} color="#fff" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: (
                <TouchableOpacity style={{ padding: 12 }} onPress={() => params.onBack()}>
                    <Icon name="md-arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
            ),
            headerRight: (
                <View style={{ marginRight: 12 }}>
                </View>
            ),
        };
    };

    constructor(props: any) {
        super(props);
        const page = this.props.navigation.getParam('page', 0);
        this.state = {
            isOpenChecklist: false,
            page,
        };
    }

    componentDidMount(): void {
        this.props.navigation.setParams({
            onPressChecklist: this.onPressChecklist,
            onBack: this.onBack,
            page: this.state.page
        });
    }

    onPressChecklist = () => {
        this.setState({
            isOpenChecklist: !this.state.isOpenChecklist
        });
    }

    onBack = () => {
        this.props.updateCurrentRoute(ScreenNames.CreateQuiz);
        this.props.navigation.navigate(ScreenNames.CreateQuiz);
    }

    onChangeHavingQuestion = (index: number, value: boolean) => {
        this.props.updateIsHavingCoverUrl(index, value);
    }

    renderFooterItem = ({ item, index }: { item: Question, index: number }) => {
        const onPress = () => {
            this.setState(
                {
                    page: index
                },
                () => this.props.navigation.setParams({ page: this.state.page })
            );
        };
        const styleContainer = this.state.page !== index
            ? {
                ...styles.FooterItem,
            }
            : {
                ...styles.FooterItem, borderWidth: 1, borderColor: '#4A7AC7'
            };
        return (
            <TouchableOpacity style={styleContainer} onPress={onPress}>
                <FastImage
                    source={item.coverUrl === '' ? require('../../../assets/images/default-question-image.jpg') : { uri: item.coverUrl }}
                    style={{ ...styles.Image }}
                    resizeMode="contain" />
                <TextMontserrat style={{ fontSize: 9, paddingTop: 2 }}>Question {index + 1}</TextMontserrat>
                {(!this.props.questionChecklist.isHavingCoverUrl[index]
                    || !this.props.questionChecklist.isHavingQuestion[index])
                    && <View style={styles.WarningIconContainer}>
                        <IconFontAwesome
                            name="exclamation"
                            size={12}
                            color="#fff"
                            style={{}} />
                    </View>}
            </TouchableOpacity>
        );
    }

    onAddQuestion = () => {
        this.setState(
            {
                page: this.props.questionsToCreate.length,
            },
            () => {
                this.props.addNewQuestion();
                this.props.navigation.setParams({ page: this.state.page });
            }
        );
    }

    render(): React.ReactNode {
        const { questionsToCreate } = this.props;
        // let isHavingCorrectAnswer = this.props.questionsToCreate[this.state.page].answers.map((item, index) => item.isCorrect ?)
        return (
            <ScrollView style={{ backgroundColor: '#ddd', height: getLayout().deviceHeight }} >
                <Tabs locked page={this.state.page} style={{ height: getLayout().deviceHeight - getStatusBarHeight() - 60 }}
                    tabBarPosition="bottom" renderTabBar={() =>
                        <View style={{ marginTop: 8, flexDirection: 'row', height: 70 }}>
                            <View style={{ width: '75%', height: 70 }}>
                                <FlatList
                                    style={{ width: '100%', backgroundColor: '#f4f4f4', height: '100%' }}
                                    data={questionsToCreate}
                                    renderItem={this.renderFooterItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal />
                            </View>
                            <TouchableOpacity style={styles.CreateQuestion} onPress={this.onAddQuestion}>
                                <IconFontAwesome name="plus" size={20} color="#fff" style={{ fontWeight: 'bold', marginVertical: 4 }} />
                                <View style={{ bottom: 4 }}>
                                    <TextMontserrat style={{ color: '#fff', fontFamily: 'Montserrat-ExtraBold', textAlign: 'center' }}>
                                        Add
                                </TextMontserrat>
                                    <TextMontserrat style={{ color: '#fff', fontFamily: 'Montserrat-ExtraBold', textAlign: 'center' }}>
                                        Question
                                </TextMontserrat>
                                </View>
                            </TouchableOpacity>
                        </View>}>
                    {questionsToCreate.map((item, index) => {
                        return (
                            <Tab heading={index.toString()} key={index}>
                                <TabChild
                                    updateIsCorrect={this.props.updateIsCorrect}
                                    navigation={this.props.navigation}
                                    updateCurrentRoute={this.props.updateCurrentRoute}
                                    updateTitleQuestion={this.props.updateTitleQuestion}
                                    question={item}
                                    index={index}
                                    updateAnswer={this.props.updateAnswer}
                                    uploadImage={this.props.uploadImage}
                                    questionChecklist={this.props.questionChecklist}
                                    onChangeHavingQuestion={this.onChangeHavingQuestion}
                                    updateIsHavingQuestion={this.props.updateIsHavingQuestion}
                                    isUploadingImage={this.props.isUploadingImage}
                                />
                            </Tab>
                        );
                    })}
                </Tabs>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isOpenChecklist}
                >
                    <Checklist
                        onBlur={this.onPressChecklist}
                        isHavingQuestion={this.props.questionChecklist.isHavingQuestion[this.state.page]}
                        isHavingCoverUrl={this.props.questionChecklist.isHavingCoverUrl[this.state.page]}
                    />
                </Modal>
            </ScrollView >
        );
    }
}
const mapState = (state: AppState) => ({
    questionsToCreate: state.quizzes.questionToCreate,
    questionChecklist: state.quizzes.questionChecklist,
    isUploadingImage: state.appState.isUploadingImage
});

const mapDispatch = ({ navigation, quizzes }: RematchDispatch<models>) => ({
    updateCurrentRoute: (name: string) => { navigation.updateCurrentRoute(name as any); },
    addNewQuestion: () => { quizzes.addNewQuestion('' as any); },
    updateIsHavingCoverUrl: (index: number, value: boolean) => { quizzes.updateIsHavingCoverUrl({ index, value } as any); },
    updateIsHavingQuestion: (index: number, value: boolean) => { quizzes.updateIsHavingQuestion({ index, value } as any); },
    updateTitleQuestion: (title: string, index: number) => { quizzes.updateTitleQuestion({ title, index } as any); },
    updateAnswer: (indexQuestion: number, indexAnswer: number, answer: string) => {
        quizzes.updateAnswer({ answer, indexQuestion, indexAnswer } as any);
    },
    updateIsCorrect: (indexQuestion: number, indexAnswer: number) => {
        quizzes.updateIsCorrect({ indexQuestion, indexAnswer } as any);
    },
    uploadImage: (uri: any, isQuestionCoverUrl: boolean, index?: number) => { quizzes.uploadImage({ uri, isQuestionCoverUrl, index } as any); },
});

export default connect(mapState, mapDispatch as any)(CreatQuizQuestion);
