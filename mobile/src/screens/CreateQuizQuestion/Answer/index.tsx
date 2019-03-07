import * as React from 'react';
import styles from './styles';
import { Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Animated, Easing, TextInput, Platform } from 'react-native';
import { getLayout } from '../../../helpers/get-layout';
import TextMontserrat from '../../../components/TextMontserrat';
import config from '../../../config';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface Props {
    onBlur: () => void;
    height: number;
    width: number;
    offsetX: number;
    offsetY: number;
    onChangeText: (text: string) => void;
    answer: number;
    onTickCorrect: () => void;
    isCorrect: boolean;
    value: string;
}
export interface State {
    animatedValue: any;
    isCorrect: boolean;
}

class BasicLayout extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            animatedValue: new Animated.Value(0),
            isCorrect: this.props.isCorrect
        };
    }

    componentDidMount(): void {
        this.animation();
    }

    animation = () => {
        Animated.timing(
            this.state.animatedValue,
            {
                toValue: 1,
                duration: 200,
                easing: Easing.linear,
            }
        ).start();
    }

    onBlur = () => {
        Animated.timing(
            this.state.animatedValue,
            {
                toValue: 0,
                duration: 200,
                easing: Easing.linear,
            }
        ).start(this.props.onBlur);
    }

    onTickIsCorrect = () => {
        this.setState(
            {
                isCorrect: !this.state.isCorrect
            },
            this.props.onTickCorrect);
    }

    render(): React.ReactNode {
        const top = this.state.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [this.props.offsetY, getLayout().deviceHeight / 2]
        });
        const left = this.state.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [this.props.offsetX, (getLayout().deviceWidth - this.props.width) / 2]
        });
        const opacity = this.state.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        return (
            <View style={{
                width: getLayout().deviceWidth,
                height: getLayout().deviceHeight,
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                zIndex: 2
            }}>
                <TouchableOpacity
                    onPress={this.onBlur}
                    style={{
                        width: getLayout().deviceWidth,
                        height: getLayout().deviceHeight,
                        zIndex: -1,
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}>
                </TouchableOpacity>

                <Animated.View style={{
                    position: 'absolute',
                    height: this.props.height,
                    width: this.props.width,
                    top,
                    left,
                    zIndex: 1
                }}>
                    <View style={{
                        ...styles.AnswerCard,
                        backgroundColor: config().backgroundColorAnswer[this.props.answer],
                        shadowColor: config().shadownColorAnswer[this.props.answer],
                        width: '100%',
                        height: '100%'
                    }}>
                        <TextInput
                            style={{
                                ...styles.AnswerText,
                                height: '100%',
                                width: '100%',
                                top: Platform.OS === 'ios' ? -4 : -10,
                                textAlignVertical: 'top'
                            }}
                            multiline
                            autoFocus
                            onChangeText={this.props.onChangeText}
                            selectionColor="#fff"
                            value={this.props.value}
                        />
                    </View>
                </Animated.View>
                <Animated.View style={{
                    position: 'absolute',
                    top: getLayout().deviceHeight / 2 + this.props.height / 2 - 25,
                    left: getLayout().deviceWidth / 2 + this.props.width / 2 + 20,
                    opacity
                }}>
                    <TouchableOpacity
                        style={{ ...styles.Circle, backgroundColor: this.state.isCorrect ? '#5FCC50' : '#ddd' }}
                        onPress={this.onTickIsCorrect}>
                        <Icon name="check" color="#fff" style={{ fontWeight: 'bold' }} size={22} />
                    </TouchableOpacity>
                </Animated.View>
            </View >
        );
    }
}

export default BasicLayout;
