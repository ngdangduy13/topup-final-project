import * as React from 'react';
import { StatusBar, ViewStyle, View, Text, TextInput, TextStyle, Animated, Easing } from 'react-native';
import config from '../../config';
import TextMontserrat from '../TextMontserrat';
import styles from './styles';

export interface Props {
    style?: ViewStyle;
    label: string;
    onChangeText?: (value: string) => void;
    value: string | undefined;
    password?: boolean;
    error?: boolean;
    backgroundColor?: string;
    disable?: boolean;
}
export interface State {
    isFocused: boolean;
    top: any;
}
class AppLoading extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isFocused: false,
            top: new Animated.Value(10),
        };
    }

    componentDidMount(): void {
        if (this.props.value !== '') {
            this.handleFocus();
        } else {
            this.handleBlur();
        }
    }

    handleFocus = () => {
        this.setState(
            { isFocused: true },
            () => Animated.timing(
                this.state.top,
                {
                    toValue: -10,
                    duration: 100,
                    easing: Easing.linear
                }
            ).start()
        );
    };

    handleBlur = () => {
        if (this.props.value === '') {
            this.setState(
                { isFocused: false },
                () => Animated.timing(
                    this.state.top,
                    {
                        toValue: 10,
                        duration: 100,
                        easing: Easing.linear
                    }
                ).start()
            );
        }
    };

    render(): React.ReactNode {
        const { label, error, backgroundColor, ...props } = this.props;
        const { isFocused } = this.state;
        const labelStyle: TextStyle = {
            // left: 22,
            fontSize: !isFocused ? 15 : 14,
            color: !error ? !isFocused ? '#8A8A8A' : '#424242' : config().dangerColor,
            backgroundColor: backgroundColor ? backgroundColor : '#fff',
            paddingHorizontal: 8,
            fontFamily: 'Montserrat-SemiBold'
        };
        const height = 40;
        return (
            <View style={{ height, position: 'relative', marginTop: 16 }}>
                <View style={{
                    height,
                    borderColor: !error ? !isFocused ? '#ABABAB' : '#8A8A8A' : config().dangerColor,
                    borderWidth: 1,
                    borderRadius: 5,
                    zIndex: -1
                }}>
                </View>
                <Animated.View
                    style={{
                        top: this.state.top, position: 'absolute', left: 12,
                        backgroundColor: backgroundColor ? backgroundColor : '#fff'
                    }}>
                    <TextMontserrat style={{ ...labelStyle, }}>
                        {label}
                    </TextMontserrat>
                </Animated.View>
                {this.props.disable
                    ? <View style={{
                        width: '85%',
                        height,
                        position: 'absolute',
                        top: 0,
                        left: 20,
                        justifyContent: 'center',
                    }}>
                        <TextMontserrat style={{
                            fontSize: 16,
                            color: '#8A8A8A',
                            fontFamily: 'Montserrat-Regular',
                        }}
                            numberOfLines={1}
                        >{this.props.value}</TextMontserrat>
                    </View>
                    : <TextInput
                        {...props}
                        style={{
                            ...styles.TextInputContainer,
                            height,
                            ...this.props.style
                        }}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        value={this.props.value}
                        onChangeText={this.props.onChangeText}
                        secureTextEntry={this.props.password}
                    />}

            </View >
        );
    }
}

export default AppLoading;
