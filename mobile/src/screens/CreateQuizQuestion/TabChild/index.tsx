import React from 'react';
import { Animated, View, Text, Image, TouchableOpacity, FlatList, Modal, Easing, KeyboardAvoidingView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { AppState } from '../../../store/state';
import { models } from '../../../store';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { Card, CardItem, Body, Item, Input, Badge, Left } from 'native-base';
import config from '../../../config';
import ScreenNames from '../../screen-names';
import Checklist from '../Checklist';
import TextMontserrat from '../../../components/TextMontserrat';
import TextInput from '../../../components/TextInput';
import { Transition } from 'react-navigation-fluid-transitions';
import Answer from '../Answer';
import CoverOptions from '../CoverOptions';
import { Question, QuestionChecklist } from '../../../store/models/quizzes/interface';
import ImagePicker from 'react-native-image-picker';
import SpinKit from 'react-native-spinkit';

export interface Props {
    updateCurrentRoute: (name: string) => void;
    updateTitleQuestion: (title: string, index: number) => void;
    updateIsHavingQuestion: (index: number, value: boolean) => void;
    updateAnswer: (indexQuestion: number, indexAnswer: number, answer: string) => void;
    updateIsCorrect: (indexQuestion: number, indexAnswer: number) => void;
    uploadImage: (uri: any, isQuestionCoverUrl: boolean, index?: number) => void; navigation: any;
    onChangeHavingQuestion: (index: number, value: boolean) => void;
    questionChecklist: QuestionChecklist;
    index: number;
    question: Question;
    isUploadingImage: boolean;
}
export interface State {
    question: string;
    isTypingAnswer: boolean;
    isAddingCover: boolean;
    answerHeight: number;
    answerWidth: number;
    answerFocusing: number;
    offsetX: number;
    offsetY: number;
    coverUrl: string;
}

class CreatQuizQuestion extends React.Component<Props, State> {
    answerA: any;
    answerB: any;
    answerC: any;
    answerD: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            question: this.props.question.description,
            isTypingAnswer: false,
            isAddingCover: false,
            answerHeight: 0,
            answerWidth: 0,
            offsetX: 0,
            offsetY: 0,
            answerFocusing: 0,
            coverUrl: this.props.question.coverUrl
        };
    }

    onBack = () => {
        this.props.updateCurrentRoute(ScreenNames.CreateQuiz);
        this.props.navigation.navigate(ScreenNames.CreateQuiz);
    }

    renderFooterItem = ({ item, index }: { item: number, index: number }) => {
        const params = this.props.navigation.getParam('index');
        const onPress = () => {
            this.props.updateCurrentRoute(ScreenNames.CreateQuizQuestion);
            this.props.navigation.push(ScreenNames.CreateQuizQuestion, { index, transition: 'createQuestionTransition', }, );
        };
        const styleContainer = params !== index
            ? {
                ...styles.FooterItem,
            }
            : {
                ...styles.FooterItem, borderWidth: 1, borderColor: '#4A7AC7'
            };
        return (
            <TouchableOpacity style={styleContainer} onPress={onPress}>
                <Image
                    source={require('../../../../assets/images/background.jpg')}
                    style={{ ...styles.Image }} />
                <Text style={{ fontSize: 9, paddingTop: 2 }}>Question {item}</Text>
            </TouchableOpacity>
        );
    }

    onClickAnswer = (answer: string, answerId: number) => {
        (this as any)[answer].measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
            this.setState({
                answerHeight: height,
                answerWidth: width,
                offsetX: px,
                offsetY: py,
                isTypingAnswer: true,
                answerFocusing: answerId
            });
        });
    }

    onBlur = () => {
        this.setState({
            isTypingAnswer: false,
            isAddingCover: false,
            answerFocusing: 0
        });
    }

    onChangeAnswer = (answer: string) => {
        this.props.updateAnswer(this.props.index, this.state.answerFocusing, answer);
    }
    onTickCorrect = () => {
        this.props.updateIsCorrect(this.props.index, this.state.answerFocusing);
    }

    onAddingCover = () => {
        this.setState({
            isAddingCover: true
        });
    }

    onOpenLibaray = () => {
        const options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, async (response) => {
            if (!response.didCancel && !response.error && !response.customButton) {
                this.setState({
                    coverUrl: response.uri,
                    isAddingCover: false
                });
                this.props.uploadImage(response.uri, true, this.props.index);
                this.props.onChangeHavingQuestion(this.props.index, true);
            }
        });
    }

    onChangeTitle = (question: string) => {
        this.setState(
            {
                question
            },
            () => {
                this.props.updateTitleQuestion(question, this.props.index);
                if (question !== '') {
                    this.props.updateIsHavingQuestion(this.props.index, true);
                }
                if (question === '') {
                    this.props.updateIsHavingQuestion(this.props.index, false);
                }
            }
        );
    }

    render(): React.ReactNode {
        return (
            <View style={{ backgroundColor: config().backgroundColor, flex: 1 }} >
                <View style={styles.Container} >
                    <TouchableOpacity
                        style={styles.ImagePickerContainer}
                        onPress={this.onAddingCover}
                        disabled={this.props.isUploadingImage}>
                        {this.state.coverUrl === ''
                            ? <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Icon name="ios-camera" size={35} color="#000" />
                                <TextMontserrat>Tap to add image or video</TextMontserrat>
                            </View>
                            : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                <Image
                                    source={{ uri: this.state.coverUrl }}
                                    style={{ ...styles.ImageCover, opacity: this.props.isUploadingImage ? 0.3 : 1 }}
                                    resizeMode="contain" />
                                {this.props.isUploadingImage &&
                                    <SpinKit
                                        size={40}
                                        color="#666666"
                                        style={styles.SpinKit}
                                        type="Wave"
                                    />}
                            </View>
                        }
                    </TouchableOpacity>

                    <View style={{ flex: 1, marginTop: 10, paddingHorizontal: '3%' }}>
                        <View>
                            <TextInput
                                value={this.props.question.description}
                                label="Question"
                                onChangeText={this.onChangeTitle}
                            />
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: '3%' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                {(this.state.isTypingAnswer && this.state.answerFocusing === 0)
                                    ? <View style={styles.EmptyAnswerCard}></View>
                                    : <View style={{
                                        ...styles.AnswerCard,
                                        backgroundColor: config().backgroundColorAnswer[0],
                                        shadowColor: config().shadownColorAnswer[0]
                                    }}
                                        ref={(view: any) => { this.answerA = view; }}>
                                        <TouchableOpacity
                                            style={styles.AnswerTextContainer}
                                            onPress={() => this.onClickAnswer('answerA', 0)}>
                                            <TextMontserrat style={styles.AnswerText}>{this.props.question.answers[0].description}</TextMontserrat>
                                        </TouchableOpacity>
                                        {this.props.question.answers[0].isCorrect &&
                                            <View style={styles.IsCorrectIconContainer}>
                                                <IconFontAwesome name="check" color="#fff" style={{ fontWeight: 'bold' }} size={12} />
                                            </View>}
                                    </View>}
                                {(this.state.isTypingAnswer && this.state.answerFocusing === 1)
                                    ? <View style={styles.EmptyAnswerCard}></View>
                                    : <View style={{
                                        ...styles.AnswerCard,
                                        backgroundColor: config().backgroundColorAnswer[1],
                                        shadowColor: config().shadownColorAnswer[1],
                                    }}
                                        ref={(view: any) => { this.answerB = view; }}>
                                        <TouchableOpacity
                                            style={styles.AnswerTextContainer}
                                            onPress={() => this.onClickAnswer('answerB', 1)}>
                                            <TextMontserrat style={styles.AnswerText}>{this.props.question.answers[1].description}</TextMontserrat>
                                        </TouchableOpacity>
                                        {this.props.question.answers[1].isCorrect &&
                                            <View style={styles.IsCorrectIconContainer}>
                                                <IconFontAwesome name="check" color="#fff" style={{ fontWeight: 'bold' }} size={12} />
                                            </View>}
                                    </View>}
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                {(this.state.isTypingAnswer && this.state.answerFocusing === 2)
                                    ? <View style={styles.EmptyAnswerCard}></View>
                                    : <View style={{
                                        ...styles.AnswerCard,
                                        backgroundColor: config().backgroundColorAnswer[2],
                                        shadowColor: config().shadownColorAnswer[2]
                                    }}
                                        ref={(view: any) => { this.answerC = view; }}>
                                        <TouchableOpacity
                                            style={styles.AnswerTextContainer}
                                            onPress={() => this.onClickAnswer('answerC', 2)}>
                                            <TextMontserrat style={styles.AnswerText}>{this.props.question.answers[2].description}</TextMontserrat>
                                        </TouchableOpacity>
                                        {this.props.question.answers[2].isCorrect &&
                                            <View style={styles.IsCorrectIconContainer}>
                                                <IconFontAwesome name="check" color="#fff" style={{ fontWeight: 'bold' }} size={12} />
                                            </View>}
                                    </View>}
                                {(this.state.isTypingAnswer && this.state.answerFocusing === 3)
                                    ? <View style={styles.EmptyAnswerCard}></View>
                                    : <View style={{
                                        ...styles.AnswerCard,
                                        backgroundColor: config().backgroundColorAnswer[3],
                                        shadowColor: config().shadownColorAnswer[3],
                                    }}
                                        ref={(view: any) => { this.answerD = view; }}>
                                        <TouchableOpacity
                                            style={styles.AnswerTextContainer}
                                            onPress={() => this.onClickAnswer('answerD', 3)}>
                                            <TextMontserrat style={styles.AnswerText}>{this.props.question.answers[3].description}</TextMontserrat>
                                        </TouchableOpacity>
                                        {this.props.question.answers[3].isCorrect &&
                                            <View style={styles.IsCorrectIconContainer}>
                                                <IconFontAwesome name="check" color="#fff" style={{ fontWeight: 'bold' }} size={12} />
                                            </View>}
                                    </View>}
                            </View>
                        </View>
                    </View>
                </View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isAddingCover}
                >
                    <CoverOptions onBlur={this.onBlur} navigation={this.props.navigation} onOpenLibrary={this.onOpenLibaray} />
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.isTypingAnswer}
                >
                    <Answer
                        onBlur={this.onBlur}
                        height={this.state.answerHeight}
                        width={this.state.answerWidth}
                        offsetX={this.state.offsetX}
                        offsetY={this.state.offsetY}
                        onChangeText={(text) => this.onChangeAnswer(text)}
                        onTickCorrect={this.onTickCorrect}
                        answer={this.state.answerFocusing}
                        isCorrect={this.props.question.answers[this.state.answerFocusing].isCorrect}
                        value={this.props.question.answers[this.state.answerFocusing].description}
                    />
                </Modal>
            </View >
        );
    }
}
const mapState = (state: AppState) => ({
});

const mapDispatch = ({ quizzes, userProfile }: RematchDispatch<models>) => ({
});

export default connect(mapState, mapDispatch as any)(CreatQuizQuestion);
