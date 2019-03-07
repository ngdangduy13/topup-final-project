import { Container, Content } from 'native-base';
import * as React from 'react';
import styles from './styles';
import { ViewStyle, StatusBar, View, TouchableOpacity } from 'react-native';
import TextMontserrat from '../TextMontserrat';
import Spinner from 'react-native-spinkit';

export interface Props {
    style?: ViewStyle;
    onPress?: () => void;
    label?: string;
    disabled?: boolean;
    isBusy?: boolean;
}
export interface State { }
class Button extends React.Component<Props, State> {
    render(): React.ReactNode {
        return (
            <TouchableOpacity style={{ ...styles.Button, ...this.props.style }} onPress={this.props.onPress} disabled={this.props.isBusy}>
                {this.props.children
                    ? this.props.children
                    : !this.props.isBusy
                        ? <TextMontserrat style={{ color: '#fff', fontFamily: 'Montserrat-ExtraBold' }}>{this.props.label}</TextMontserrat>
                        : <Spinner type="ThreeBounce" size={32} color="#fff" />
                }
            </TouchableOpacity>
        );
    }
}

export default Button;
