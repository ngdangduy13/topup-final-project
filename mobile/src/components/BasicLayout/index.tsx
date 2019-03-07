import { Container, Content } from 'native-base';
import * as React from 'react';
import styles from './styles';
import { ViewStyle, StatusBar, View } from 'react-native';

export interface Props {
    styles?: ViewStyle;
    isFullscreen?: boolean;
    image?: boolean;
    backgroundColor?: string;
    blackStatusBar?: boolean;
}
export interface State { }
class BasicLayout extends React.Component<Props, State> {
    render(): React.ReactNode {
        const containerStyle = this.props.styles ? { ...styles.Container, ...this.props.styles } : styles.Container;
        return (
            <Container style={containerStyle}>
                {this.props.blackStatusBar
                    ? <StatusBar barStyle="dark-content" />
                    : <StatusBar barStyle="light-content" />}
                <View style={{ flex: 1 }}>
                    {this.props.children}
                </View>
            </Container>
        );
    }
}

export default BasicLayout;
