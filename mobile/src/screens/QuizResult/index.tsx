import { Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { NavigationScreenProps, NavigationActions } from 'react-navigation';
import { AppState } from '../../store/state';
import { RematchDispatch } from '@rematch/core';
import { models } from '../../store';
import { connect } from 'react-redux';
import styles from './styles';
import BasicLayout from '../../components/BasicLayout';
import serviceProvider from '../../services/service.provider';
import ScreenNames from '../screen-names';
import TextMontserrat from '../../components/TextMontserrat';
import { QuestionResult, SingleQuiz } from '../../store/models/quizzes/interface';
import Button from '../../components/Button';
import { Spinner } from 'native-base';
import config from '../../config';
export interface QuestDetailProps extends NavigationScreenProps {
    updateCurrentRoute: (name: string) => void;
    questionResult: QuestionResult;
    quizIsPlaying: SingleQuiz;
    isBusy: boolean;
}

class QuestDetail extends React.Component<QuestDetailProps, any> {
    static navigationOptions: any = ({ navigation }: { navigation: any }) => ({
        header: null
    });

    constructor(props: any) {
        super(props);
    }

    onGoHome = () => {
        this.props.updateCurrentRoute(ScreenNames.Discovery);
        this.props.navigation.navigate(ScreenNames.Discovery);
    }

    onGoScoreboard = () => {
        this.props.updateCurrentRoute(ScreenNames.QuizScoreboard);
        this.props.navigation.navigate(ScreenNames.QuizScoreboard);
    }

    render(): JSX.Element {
        const { questionResult, quizIsPlaying } = this.props;
        if (this.props.isBusy) {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: '#fff' }}>
                    <Spinner color={config().primaryColor} />

                </View>
            );
        }
        return (
            <BasicLayout>
                <View style={styles.Container}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 18, paddingVertical: '5%' }}>Conglaturation!</Text>
                    <TextMontserrat>
                        You have answered {questionResult.correctAnswerCount}/{quizIsPlaying.questionCount} questions correctly
                    </TextMontserrat>

                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 22, paddingVertical: '8%' }}>
                        Total score: {questionResult.points}
                    </Text>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 18, paddingBottom: '8%' }}>
                        Reward points: {questionResult.rewardPoints}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        {/* <Button
                            label="Scoreboard"
                            style={styles.Button}
                            onPress={this.onGoScoreboard} /> */}
                        <Button
                            label="Home"
                            onPress={this.onGoHome}
                            style={styles.Button} />
                    </View>

                </View>
            </BasicLayout >
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    questionResult: state.quizzes.questionResult,
    quizIsPlaying: state.quizzes.quizIsPlaying,
    isBusy: state.appState.isBusy
});

const mapDispatchToProps = ({ navigation }: RematchDispatch<models>) => ({
    updateCurrentRoute: (name: string) => navigation.updateCurrentRoute(name as any),
});

export default connect(mapStateToProps, mapDispatchToProps as any)(QuestDetail);
