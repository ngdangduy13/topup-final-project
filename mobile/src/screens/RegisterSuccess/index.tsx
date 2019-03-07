import { NavigationScreenProps } from 'react-navigation';
import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { H1, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScreenNames from '../screen-names';
import { AppState } from '../../store/state';
import { RematchDispatch } from '@rematch/core';
import { models } from '../../store';
import { connect } from 'react-redux';
import config from '../../config';
import BasicLayout from '../../components/BasicLayout';
import styles from './styles';
import TextMontserrat from '../../components/TextMontserrat';

export interface RegisterSuccessProps extends NavigationScreenProps {
    updateCurrentRoute: (name: string) => void;
    getAllQuizzes: (state: string, isLoadMore: boolean) => void;
}

class RegisterSuccess extends React.Component<RegisterSuccessProps, any> {

    timeout: any;
    constructor(props: any) {
        super(props);
    }

    componentDidMount(): void {
        this.timeout = setTimeout(this.goHome, 3000);
    }

    goHome = () => {
        clearTimeout(this.timeout);
        this.props.getAllQuizzes(config().quizState.published, false);
        this.props.updateCurrentRoute(ScreenNames.Discovery);
        this.props.navigation.navigate(ScreenNames.Discovery, { profileImgUrl: '' });
    }

    render(): JSX.Element {
        return (
            <BasicLayout>
                <TouchableWithoutFeedback style={styles.Container} onPress={this.goHome}>
                    <View style={styles.Container}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 22, paddingVertical: '8%' }}>
                            That's it!
                    </Text>
                        <Icon name="check" size={80} color="#000" style={{ paddingVertical: 14 }} />
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 18, paddingVertical: '5%' }}> Thanks for registration</Text>

                        <View style={styles.PointContainer}>
                            <TextMontserrat style={{ color: '#fff', fontFamily: 'Montserrat-SemiBold', }}>+1000</TextMontserrat>
                        </View>

                    </View>

                </TouchableWithoutFeedback>
            </BasicLayout >
        );
    }
}

const mapStateToProps = (state: AppState) => ({});
const mapDispatchToProps = ({ navigation, quizzes }: RematchDispatch<models>) => ({
    updateCurrentRoute: (name: string) => navigation.updateCurrentRoute(name as any),
    getAllQuizzes: (state: string, isLoadMore: boolean) => { quizzes.getAllQuizzes({ state, isLoadMore } as any); },
});

export default connect(mapStateToProps, mapDispatchToProps as any)(RegisterSuccess);
