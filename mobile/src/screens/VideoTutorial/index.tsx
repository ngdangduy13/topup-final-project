import React from 'react';
import { Animated, View, Text, Image, FlatList, TouchableOpacity, StatusBar, TextInput, Linking, Clipboard } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { AppState } from '../../store/state';
import { models } from '../../store';
import BasicLayout from '../../components/BasicLayout';
import moment from 'moment';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenNames from '../screen-names';
import { Card, CardItem, Body, Left } from 'native-base';
import TextMontserrat from '../../components/TextMontserrat';
import config from '../../config';
import Button from '../../components/Button';

export interface Props extends NavigationScreenProps {
    updateCurrentRoute: (name: string) => void;
}
export interface State {
    isDateTimePickerVisible: boolean;
    date: any;
    link: string;
}

class DatePicker extends React.Component<Props, State> {
    static navigationOptions: any = ({ navigation }: { navigation: any }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Add YouTube Video',
            headerStyle: {
                backgroundColor: config().backgroundColor,
                height: 60
            },
            headerLeft: (
                <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => params.onBack()}>
                    <Icon name="md-arrow-back" size={26} color="#000" />
                </TouchableOpacity>
            ),
            headerRight: (
                <View></View>
            ),
            headerTitleStyle: {
                color: '#000',
                fontFamily: 'Montserrat-Regular',
            },
        };
    };

    constructor(props: any) {
        super(props);
        this.state = {
            isDateTimePickerVisible: false,
            date: new Date(),
            link: ''
        };
    }

    componentDidMount(): void {
        this.props.navigation.setParams({
            onBack: this.onBack
        });
    }

    onBack = () => {
        this.props.updateCurrentRoute(ScreenNames.CreateQuizQuestion);
        this.props.navigation.navigate(ScreenNames.CreateQuizQuestion);
    }

    onOpenYouTube = () => {
        const url = 'https://youtube.com';
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    }

    onPaste = async () => {
        const link = await Clipboard.getString();
        this.setState({
            link
        });
    }

    render(): React.ReactNode {
        return (
            <BasicLayout styles={{ backgroundColor: '#F7F7F7' }} blackStatusBar>
                <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#DE3249', justifyContent: 'center', }}>
                    <View>
                        <TextMontserrat style={styles.TextWhite}>1. Find a YouTube video</TextMontserrat>
                        <TextMontserrat style={styles.TextWhite}>2. Copy the link</TextMontserrat>
                        <TextMontserrat style={styles.TextWhite}>3. Paste it into the field below</TextMontserrat>
                    </View>
                </View>
                <View style={{ flex: 1.5, paddingVertical: '7%', paddingHorizontal: '4%' }}>
                    <View>
                        <TextMontserrat style={styles.TextBlack}>Find a YouTube Video</TextMontserrat>
                        <TouchableOpacity style={styles.OpenContainer} onPress={this.onOpenYouTube}>
                            <Icon name="logo-youtube" size={26} color="#DE3249" />
                            <TextMontserrat style={{ fontFamily: 'Montserrat-SemiBold', paddingHorizontal: 8 }}>Open YouTube</TextMontserrat>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: '10%' }}>
                        <TextMontserrat style={styles.TextBlack}>Paste Link</TextMontserrat>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <TextInput
                                value={this.state.link}
                                style={{ ...styles.OpenContainer, width: '75%', marginRight: '2%', paddingHorizontal: 8 }} />
                            <Button
                                onPress={this.onPaste}
                                style={{ width: '21%', marginLeft: '2%' }}
                                label="Paste"
                            />
                        </View>

                    </View>
                </View>
            </BasicLayout >
        );
    }
}
const mapState = (state: AppState) => ({
});

const mapDispatch = ({ navigation, userProfile }: RematchDispatch<models>) => ({
    updateCurrentRoute: (name: string) => { navigation.updateCurrentRoute(name as any); },
});

export default connect(mapState, mapDispatch as any)(DatePicker);
