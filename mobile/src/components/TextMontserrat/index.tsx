import { Container, Content } from 'native-base';
import * as React from 'react';
import { Text, TextStyle } from 'react-native';

export interface Props {
    style?: TextStyle;
}
export interface State { }
class TextMontserrat extends React.Component<any, State> {
    render(): React.ReactNode {
        return (
            <Text  {...this.props} style={{ fontFamily: 'Montserrat-Regular', ...this.props.style }}>{this.props.children}</Text>
        );
    }
}

export default TextMontserrat;
