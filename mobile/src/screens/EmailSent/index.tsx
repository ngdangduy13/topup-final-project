import { Text, View } from 'react-native';
import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScreenNames from '../screen-names';
import { Button } from 'native-base';
import config from '../../config';

export interface EmailSentProps extends NavigationScreenProps { }

class EmailSent extends React.Component<EmailSentProps, any> {
    constructor(props: any) {
        super(props);
    }

    _backToLogin = () => {
        this.props.navigation.navigate(ScreenNames.Login);
    }
    render(): JSX.Element {
        return (
            <View style={{ width: '100%', paddingHorizontal: '10%', paddingVertical: '25%', flex: 1 }}>
                <Icon size={80} name="diamond" color="#000" style={{ alignSelf: 'center', marginBottom: 15 }} />
                <Text style={{ marginVertical: 15 }}>Password recovery has been sent to your email</Text>
                <Button
                    onPress={this._backToLogin}
                    style={{ backgroundColor: config().primaryColor, }}
                    full
                >
                    <Text>Back to Login</Text>
                </Button>
            </View>
        );
    }
}

export default EmailSent;
