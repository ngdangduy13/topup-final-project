import React from 'react';
import { Animated, View, Text, Image, FlatList, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { AppState } from '../../store/state';
import { models } from '../../store';
import BasicLayout from '../../components/BasicLayout';
import moment from 'moment';
import styles from './styles';
import config from '../../config';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, CardItem, Body, Item, Input, Textarea, Form, Switch, Left, Spinner } from 'native-base';
import ScreenNames from '../screen-names';
import Checklist from './Checklist';
import TextMontserrat from '../../components/TextMontserrat';
import TextInput from '../../components/TextInput';
import TextArea from '../../components/TextArea';
import Checkbox from 'react-native-modest-checkbox';
import ImagePicker from 'react-native-image-picker';
import { Question, UpdateQuizToCreateParam, QuizToCreate, QuestionChecklist, UpdateQuizParams } from '../../store/models/quizzes/interface';
import serviceProvider from '../../services/service.provider';
import SpinKit from 'react-native-spinkit';
import FastImage from 'react-native-fast-image';

export interface Props extends NavigationScreenProps {
    currentRoute: string;
    questionToCreat: Question[];
    quizToCreate: QuizToCreate;
    isBusy: boolean;
    isUploadingImage: boolean;
    questionChecklist: QuestionChecklist;
    updateCurrentRoute: (name: string) => void;
    createQuiz: () => void;
    updateQuiz: (value: UpdateQuizParams) => void;
    addQuestion: () => void;
    uploadImage: (uri: any, isQuestionCoverUrl: boolean) => void;
    updateQuizToCreate: (value: UpdateQuizToCreateParam) => void;
    resetQuizToCreate: () => void;
    deleteQuestionToCreate: (value: number) => void;
}
export interface State {
    quizState: number;
    isOpenChecklist: boolean;
    isActiveBeacon: boolean;
    coverUrl: string;
    isEditing: boolean;
}

class CreateQuiz extends React.Component<Props, State> {

    static navigationOptions: any = ({ navigation }: { navigation: any }) => {
        const { params = {} } = navigation.state;
        return {
            headerTitle: (
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => params.onPressChecklist()}>
                        <TextMontserrat style={{ ...styles.HeaderText, fontSize: 18 }}>Checklist</TextMontserrat>
                        <Icon name="ios-alert" size={20} color="#fff" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                    {/* <View style={styles.LineContainer}>
                        <View style={[styles.Line, { width: '50%' }]}></View>
                    </View> */}
                </View>
            ),
            headerLeft: (
                <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => params.onBack()}>
                    <TextMontserrat style={styles.HeaderText}>Cancel</TextMontserrat>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity style={{ marginRight: 12 }} onPress={() => params.onDone()}>
                    <TextMontserrat style={styles.HeaderText}>Done</TextMontserrat>
                </TouchableOpacity>
            ),
        };
    };

    constructor(props: any) {
        super(props);
        const isEditing = this.props.navigation.getParam('isEditing', false);
        this.state = {
            quizState: 0,
            isOpenChecklist: false,
            isActiveBeacon: this.props.quizToCreate.beacon.isActive,
            coverUrl: this.props.quizToCreate.coverImageUrl,
            isEditing
        };
    }

    componentDidMount(): void {
        this.props.navigation.setParams({
            onPressChecklist: this.onPressChecklist,
            onBack: this.onBack,
            onDone: this.onDone
        });
    }

    onDone = () => {
        let count: number = 0;
        for (const i of Object.keys(this.props.questionChecklist)) {
            for (const x of (this.props.questionChecklist as any)[i]) {
                if (!x) {
                    count = count + 1;
                }
            }
        }
        let isFullRequirementQuestion: boolean = false;
        if (count === 0
            && this.props.questionChecklist.isHavingCoverUrl.length !== 0
            && this.props.questionChecklist.isHavingQuestion.length !== 0
        ) {
            isFullRequirementQuestion = true;
        } else {
            isFullRequirementQuestion = false;
        }
        if (this.props.quizToCreate.state === config().quizState.draft) {
            this.props.createQuiz();
            this.props.updateCurrentRoute(ScreenNames.ManageQuizzes);
            serviceProvider.NavigatorService().navigate(ScreenNames.ManageQuizzes);
        } else {
            if (this.props.quizToCreate.coverImageUrl !== ''
                && this.props.quizToCreate.description !== ''
                && this.props.quizToCreate.title !== ''
                && isFullRequirementQuestion) {
                if (this.props.quizToCreate._id === '') {
                    this.props.createQuiz();
                    this.props.updateCurrentRoute(ScreenNames.ManageQuizzes);
                    serviceProvider.NavigatorService().navigate(ScreenNames.ManageQuizzes);
                } else {
                    const currentState = this.props.navigation.getParam('currentState', 'DRAFT');
                    this.props.updateQuiz({ stateUpdate: this.props.quizToCreate.state, currentState });
                    this.props.updateCurrentRoute(ScreenNames.ManageQuizzes);
                    serviceProvider.NavigatorService().navigate(ScreenNames.ManageQuizzes);
                }
            } else {
                this.setState({ isOpenChecklist: true });
            }
        }
    }

    onBack = () => {
        this.props.resetQuizToCreate();
        this.props.updateCurrentRoute(ScreenNames.ManageQuizzes);
        this.props.navigation.navigate(ScreenNames.ManageQuizzes);
    }

    onPressChecklist = () => {
        this.setState({
            isOpenChecklist: !this.state.isOpenChecklist
        });
    }

    onSwitch = () => {
        this.props.updateQuizToCreate({ isActive: !this.props.quizToCreate.beacon.isActive });
    }

    onCheckbox = (quizState: string) => {
        this.props.updateQuizToCreate({ state: quizState });
    }

    onAddQuestion = () => {
        if (this.props.questionToCreat.length === 0) {
            this.props.addQuestion();
        }
        this.props.updateCurrentRoute(ScreenNames.CreateQuizQuestion);
        this.props.navigation.navigate(ScreenNames.CreateQuizQuestion);
    }

    onAddCover = () => {
        const options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (!response.didCancel && !response.error && !response.customButton) {
                const coverUrl = 'data:image/jpeg;base64,' + response.data;
                this.setState(
                    {
                        coverUrl
                    },
                    () => this.props.uploadImage(response.uri, false)
                );
            }
        });
    }

    renderQuestionRow = ({ item, index }: { item: Question, index: number }) => {
        let correctAnswer = '';
        for (const answer of item.answers) {
            if (answer.isCorrect) {
                correctAnswer = answer.description;
                break;
            }
        }
        const onDelete = () => {
            this.props.deleteQuestionToCreate(index);
        };
        const onPress = () => {
            this.props.updateCurrentRoute(ScreenNames.CreateQuizQuestion);
            this.props.navigation.navigate(ScreenNames.CreateQuizQuestion, { page: index });
        };
        const { questionChecklist } = this.props;
        return (
            <TouchableWithoutFeedback style={styles.CardContainer} onPress={onPress}>
                <View>
                    <Card>
                        <CardItem >
                            <Left>
                                <TextMontserrat
                                    style={{ fontSize: 12, fontFamily: 'Montserrat-SemiBold', color: '#787878' }}>
                                    Question {index + 1}
                                </TextMontserrat>
                            </Left>
                        </CardItem>
                        <CardItem cardBody>
                            <Left style={{ alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%' }}>
                                <FastImage
                                    source={item.coverUrl === ''
                                        ? require('../../../assets/images/default-question-image.jpg')
                                        : { uri: `${config().hostUrl}${config().imageUrl}${item.coverUrl}` }}
                                    style={styles.ImageQuestion}
                                    resizeMode="contain" />
                                <View style={{ paddingRight: 30, width: '70%' }}>
                                    <TextMontserrat style={{ fontWeight: 'bold', flexWrap: 'wrap' }}>{item.description}</TextMontserrat>
                                    <TextMontserrat style={{ fontSize: 12, paddingVertical: 4, color: '#949494' }}>
                                        Answer: {correctAnswer}
                                    </TextMontserrat>
                                </View>
                                <TouchableOpacity style={{ position: 'absolute', bottom: 4, right: 8, padding: 10 }} onPress={onDelete}>
                                    <Icon name="md-trash" size={20} color="#ddd" />
                                </TouchableOpacity>
                            </Left>
                        </CardItem>
                        {(!questionChecklist.isHavingCoverUrl[index] || !questionChecklist.isHavingQuestion[index])
                            && <View style={styles.WarningIconContainer}>
                                <IconFontAwesome
                                    name="exclamation"
                                    size={18}
                                    color="#fff"
                                    style={{}} />
                            </View>}
                    </Card>
                </View>
            </TouchableWithoutFeedback >

        );
    }

    render(): React.ReactNode {
        if (this.props.isBusy) {
            return (
                <Spinner color={config().primaryColor} />
            );
        }
        let count: number = 0;
        for (const i of Object.keys(this.props.questionChecklist)) {
            for (const x of (this.props.questionChecklist as any)[i]) {
                if (!x) {
                    count = count + 1;
                }
            }
        }
        let isFullRequirementQuestion: boolean = false;
        if (count === 0
            && this.props.questionChecklist.isHavingCoverUrl.length !== 0
            && this.props.questionChecklist.isHavingQuestion.length !== 0
        ) {
            isFullRequirementQuestion = true;
        } else {
            isFullRequirementQuestion = false;
        }
        return (
            <BasicLayout styles={{ backgroundColor: '#fff' }} >
                <ScrollView style={styles.Container}>
                    <TouchableOpacity onPress={this.onAddCover} disabled={this.props.isUploadingImage}>
                        {(this.props.quizToCreate.coverImageUrl !== '' || this.state.coverUrl !== '')
                            ? <View>
                                <FastImage
                                    source={{ uri: this.state.coverUrl === '' ? this.props.quizToCreate.coverImageUrl : this.state.coverUrl }}
                                    style={{ ...styles.ImageCover, opacity: this.props.isUploadingImage ? 0.3 : 1 }}
                                    borderRadius={5}
                                    resizeMode="cover" />
                                {this.props.isUploadingImage &&
                                    <SpinKit
                                        size={40}
                                        color="#666666"
                                        style={styles.SpinKit}
                                        type="Wave"
                                    />}
                            </View>
                            : <View style={styles.PickImageContainer}>
                                <TextMontserrat>Tap to add cover image</TextMontserrat>
                            </View>
                        }

                    </TouchableOpacity>
                    <View style={{ marginVertical: 4 }}>
                        <TextInput
                            value={this.props.quizToCreate.title}
                            label="Title"
                            onChangeText={(title: string) => this.props.updateQuizToCreate({ title })}
                        />
                    </View>
                    <View style={{ marginVertical: 4 }}>
                        <TextArea
                            value={this.props.quizToCreate.description}
                            label="Description"
                            onChangeText={(description: string) => this.props.updateQuizToCreate({ description })}
                        />
                    </View>
                    <View style={{ marginVertical: 18 }}>
                        <Text style={styles.TitleText}>State</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.StateItemContainer}>
                                <Checkbox
                                    label="Draft"
                                    onChange={() => this.onCheckbox(config().quizState.draft)}
                                    checked={this.props.quizToCreate.state === config().quizState.draft}
                                    labelStyle={{ fontSize: 14, fontFamily: 'Montserrat-Regular' }}
                                />
                            </View>
                            <View style={styles.StateItemContainer}>
                                <Checkbox
                                    label="Publish"
                                    onChange={() => this.onCheckbox(config().quizState.published)}
                                    checked={this.props.quizToCreate.state === config().quizState.published}
                                    labelStyle={{ fontSize: 14, fontFamily: 'Montserrat-Regular' }}
                                />
                            </View>
                            {this.state.isEditing &&
                                <View style={styles.StateItemContainer}>
                                    <Checkbox
                                        label="Removed"
                                        onChange={() => this.onCheckbox(config().quizState.removed)}
                                        checked={this.props.quizToCreate.state === config().quizState.removed}
                                        labelStyle={{ fontSize: 14, fontFamily: 'Montserrat-Regular' }}
                                    />
                                </View>
                            }
                        </View>
                    </View>
                    <View style={{ marginVertical: 8, flexDirection: 'row' }}>
                        <TextMontserrat style={styles.TitleText}>Beacon Integration</TextMontserrat>
                        <Switch
                            value={this.props.quizToCreate.beacon.isActive}
                            style={{ marginLeft: '4%' }}
                            onValueChange={this.onSwitch} />
                    </View>
                    {(this.props.quizToCreate.beacon.isActive) &&
                        <View style={{ marginVertical: 8 }}>
                            <TextInput
                                value={this.props.quizToCreate.beacon.uuid}
                                label="UUID"
                                onChangeText={(uuid: string) => this.props.updateQuizToCreate({ uuid })}
                            />
                            <TextInput
                                value={this.props.quizToCreate.beacon.major}
                                label="Major"
                                onChangeText={(major: string) => this.props.updateQuizToCreate({ major })}
                            />
                            <TextInput
                                value={this.props.quizToCreate.beacon.minor}
                                label="Minor"
                                onChangeText={(minor) => this.props.updateQuizToCreate({ minor })}
                            />
                        </View>}

                    <View style={{ marginVertical: 8, paddingBottom: 70, }}>
                        <TextMontserrat style={styles.TitleText}>Question</TextMontserrat>
                        <FlatList
                            style={{ width: '100%' }}
                            data={this.props.questionToCreat}
                            renderItem={this.renderQuestionRow}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </ScrollView>
                <TouchableOpacity style={styles.CreateQuestion} onPress={this.onAddQuestion}>
                    <IconFontAwesome name="plus" size={22} color="#fff" style={{ fontWeight: 'bold' }} />
                    <TextMontserrat style={{ color: '#fff', fontFamily: 'Montserrat-ExtraBold', paddingLeft: 8 }}>Add Question</TextMontserrat>
                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isOpenChecklist}
                >
                    <Checklist
                        onBlur={this.onPressChecklist}
                        isHavingCoverImage={this.props.quizToCreate.coverImageUrl !== ''}
                        isHavingTitle={this.props.quizToCreate.title !== ''}
                        isHaveDescription={this.props.quizToCreate.description !== ''}
                        isFullRequirementQuestion={isFullRequirementQuestion}
                    />
                </Modal>
            </BasicLayout >
        );
    }
}
const mapState = (state: AppState) => ({
    currentRoute: state.navigation.currentRoute,
    questionToCreat: state.quizzes.questionToCreate,
    questionChecklist: state.quizzes.questionChecklist,
    quizToCreate: state.quizzes.quizToCreate,
    isBusy: state.appState.isBusy,
    isUploadingImage: state.appState.isUploadingImage
});

const mapDispatch = ({ navigation, quizzes }: RematchDispatch<models>) => ({
    updateCurrentRoute: (name: string) => { navigation.updateCurrentRoute(name as any); },
    createQuiz: () => { quizzes.createQuiz('' as any); },
    updateQuiz: (value: UpdateQuizParams) => { quizzes.updateQuiz(value as any); },
    resetQuizToCreate: () => { quizzes.resetQuizToCreate('' as any); },
    addQuestion: () => { quizzes.addNewQuestion('' as any); },
    uploadImage: (uri: any, isQuestionCoverUrl: boolean) => { quizzes.uploadImage({ uri, isQuestionCoverUrl } as any); },
    updateQuizToCreate: (value: UpdateQuizToCreateParam) => { quizzes.updateQuizToCreate(value as any); },
    deleteQuestionToCreate: (value: number) => { quizzes.deleteQuestionToCreate(value as any); },
});

export default connect(mapState, mapDispatch as any)(CreateQuiz);
