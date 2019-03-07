import React from 'react';
import { Animated, View, Text, Image, TouchableOpacity, TextInput, FlatList, Modal, Platform, Easing } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { AppState } from '../../../store/state';
import { models } from '../../../store';
import styles from './styles';
import config from '../../../config';
import TextMontserrat from '../../../components/TextMontserrat';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface Props {
    isCorrect: boolean;
    answer: string;
    indexAnswer: number;
    animationValue: any;
    onPress: () => void;
    disable: boolean;
    answerIsClickied: number;
}
export interface State {
}

class QuestionAnswer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
        };
    }
    componentWillReceiveProps(nextProps: any): void {
        // console.log(nextProps);
    }

    render(): React.ReactNode {
        const backgroundColorAnswer = this.props.animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [config().backgroundColorAnswer[this.props.indexAnswer], this.props.isCorrect ? '#1bc150' : '#f95e64']
        });
        const shadowColorAnswer = this.props.animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [config().shadownColorAnswer[this.props.indexAnswer], this.props.isCorrect ? '#000' : '#000']
        });
        const opacityWrongAnswer = this.props.animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.6]
        });
        const opacityCheck = this.props.animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.4]
        });
        return (
            <Animated.View style={{
                ...styles.AnswerCard,
                backgroundColor: backgroundColorAnswer,
                opacity: (this.props.isCorrect || this.props.answerIsClickied === this.props.indexAnswer) ? 1 : opacityWrongAnswer,
                shadowColor: shadowColorAnswer,
            }}>
                <TouchableOpacity style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', }}
                    onPress={this.props.onPress}
                    disabled={this.props.disable}>
                    <TextMontserrat style={styles.AnswerText}>{this.props.answer}</TextMontserrat>
                </TouchableOpacity>
                {this.props.isCorrect &&
                    <Animated.View style={{ ...styles.CheckIconContainer, opacity: opacityCheck }}>
                        <Icon name="check" size={80} color="#fff" />
                    </Animated.View>}
                {(!this.props.isCorrect && this.props.answerIsClickied === this.props.indexAnswer) &&
                    <Animated.View style={{ ...styles.CheckIconContainer, opacity: opacityCheck,  }}>
                        <Icon name="ban" size={80} color="#fff" />
                    </Animated.View>}

            </Animated.View>
        );
    }
}
const mapState = (state: AppState) => ({
});

const mapDispatch = ({ navigation, userProfile }: RematchDispatch<models>) => ({
});

export default connect(mapState, mapDispatch as any)(QuestionAnswer);
