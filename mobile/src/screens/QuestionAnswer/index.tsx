import React from 'react';
import { Animated, View, Text, Image, TouchableOpacity, TextInput, FlatList, Modal, Platform, Easing } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { AppState } from '../../store/state';
import { models } from '../../store';
import BasicLayout from '../../components/BasicLayout';
import moment from 'moment';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, CardItem, Body, Item, Input, Badge, Left } from 'native-base';
import config from '../../config';
import ScreenNames from '../screen-names';
import { getLayout } from '../../helpers/get-layout';
import TextMontserrat from '../../components/TextMontserrat';
import { Question, QuestionAnswer } from '../../store/models/quizzes/interface';
import Answer from './Answer';
import FastImage from 'react-native-fast-image';

export interface Props extends NavigationScreenProps {
    updateCurrentRoute: (name: string) => void;
    submitAnswer: () => void;
    updateQuestionAnswer: (value: QuestionAnswer) => void;
    questionsIsPlaying: Question[];
}
export interface State {
    answerAnimationValue: any;
    index: number;
    isOutOfQuestion: boolean;
    isDoneAnswering: boolean;
    answerIsClicked: number;
}

class QuestionAnswerScreen extends React.Component<Props, State> {
    static navigationOptions: any = ({ navigation }: { navigation: any }) => {
        const { params = {} } = navigation.state;
        return {
            header: null
        };
    };

    constructor(props: any) {
        super(props);
        const index = this.props.navigation.getParam('index', 0);
        this.state = {
            answerAnimationValue: new Animated.Value(0),
            index,
            isOutOfQuestion: false,
            isDoneAnswering: false,
            answerIsClicked: -1
        };
    }

    onNext = () => {
        if (this.state.index + 1 !== this.props.questionsIsPlaying.length) {
            this.props.updateCurrentRoute(ScreenNames.QuestionAnswer);
            this.props.navigation.navigate({
                routeName: ScreenNames.QuestionAnswer,
                params: {
                    index: this.state.index + 1
                },
                key: ScreenNames.QuestionAnswer + this.state.index
            });
        }
        this.props.updateQuestionAnswer({
            questionId: this.props.questionsIsPlaying[this.state.index].id,
            answerId: this.props.questionsIsPlaying[this.state.index].answers[this.state.answerIsClicked].id
        });
    }

    onFinish = () => {
        this.props.updateQuestionAnswer({
            questionId: this.props.questionsIsPlaying[this.state.index].id,
            answerId: this.props.questionsIsPlaying[this.state.index].answers[this.state.answerIsClicked].id
        });
        this.props.updateCurrentRoute(ScreenNames.QuizResult);
        this.props.navigation.navigate(ScreenNames.QuizResult);
        this.props.submitAnswer();
    };

    answer = (index: number) => {
        this.setState(
            {
                isDoneAnswering: true,
                answerIsClicked: index,
                isOutOfQuestion: this.state.index + 1 === this.props.questionsIsPlaying.length ? true : false
            },
            () => Animated.timing(
                this.state.answerAnimationValue,
                {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.linear,
                }
            ).start()
        );
    }

    propsForButtonIndex = (index: number) => {
        const questionIsPlaying = this.props.questionsIsPlaying[this.state.index];
        return {
            onPress: () => this.answer(index),
            answer: questionIsPlaying.answers[index].description,
            isCorrect: questionIsPlaying.answers[index].isCorrect,
            indexAnswer: index,
            animationValue: this.state.answerAnimationValue,
            disable: this.state.isDoneAnswering,
            answerIsClickied: this.state.answerIsClicked
        };
    }

    render(): React.ReactNode {
        const questionIsPlaying = this.props.questionsIsPlaying[this.state.index];
        return (
            <BasicLayout styles={{ backgroundColor: '#fff', paddingTop: Platform.OS === 'ios' ? 20 : 0 }} >
                <View style={styles.Container} >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                        <FastImage source={{ uri: `${config().hostUrl}${config().imageUrl}${questionIsPlaying.coverUrl}` }} style={styles.Image}
                            resizeMode="contain" />
                    </View>

                    <View style={{ flex: 1.5, marginTop: 10, paddingHorizontal: '3%' }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <TextMontserrat style={styles.HeaderText}>{questionIsPlaying.description}</TextMontserrat>
                        </View>
                        <View style={{ flex: 3, width: '100%' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Answer {...this.propsForButtonIndex(0)} />
                                <Answer {...this.propsForButtonIndex(1)} />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Answer {...this.propsForButtonIndex(2)} />
                                <Answer {...this.propsForButtonIndex(3)} />
                            </View>
                        </View>

                    </View>
                    <View style={{ marginTop: 8, height: 90, paddingHorizontal: '3%', justifyContent: 'center', alignItems: 'center' }}>
                        {this.state.isOutOfQuestion
                            ? <TouchableOpacity style={styles.NextButton} onPress={this.onFinish}>
                                <TextMontserrat style={{ color: '#fff', fontFamily: 'Montserrat-ExtraBold' }}>Finish</TextMontserrat>
                            </TouchableOpacity>
                            : <View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                                <TouchableOpacity
                                    style={[styles.NextButton, { marginBottom: 12, opacity: this.state.isDoneAnswering ? 1 : 0.6 }]}
                                    onPress={this.onNext} disabled={!this.state.isDoneAnswering}>
                                    <TextMontserrat style={{ color: '#fff', fontFamily: 'Montserrat-ExtraBold' }}>Next</TextMontserrat>
                                </TouchableOpacity>
                                <View style={styles.LineContainer}>
                                    <View
                                        style={[styles.Line, {
                                            width: `${(this.state.index + 1) / this.props.questionsIsPlaying.length * 100}%`
                                        }]}>
                                    </View>
                                </View>
                            </View>}
                    </View>
                </View>
            </BasicLayout >
        );
    }
}
const mapState = (state: AppState) => ({
    questionsIsPlaying: state.quizzes.quizIsPlaying.questions
});

const mapDispatch = ({ navigation, quizzes }: RematchDispatch<models>) => ({
    updateCurrentRoute: (name: string) => { navigation.updateCurrentRoute(name as any); },
    updateQuestionAnswer: (value: QuestionAnswer) => { quizzes.updateQuestionAnswer(value as any); },
    submitAnswer: () => { quizzes.submitAnswer('' as any); },
});

export default connect(mapState, mapDispatch as any)(QuestionAnswerScreen);
