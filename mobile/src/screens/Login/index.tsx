import React from 'react';
import { Animated, View, Text, TouchableOpacity, Image, Linking, Platform, KeyboardAvoidingView } from 'react-native';
import { Icon } from 'native-base';
import ScreenNames from '../screen-names';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { AppState } from '../../store/state';
import { models } from '../../store';
import DateTimePicker from 'react-native-modal-datetime-picker';
import config from '../../config';
import Button from '../../components/Button';
import TextMontserrat from '../../components/TextMontserrat';
import TextInput from '../../components/TextInput';
import BasicLayout from '../../components/BasicLayout';
import { Formik, Field, FormikActions } from 'formik';
import { object as yupObject, string as yupString } from 'yup';
import styles from './styles';

export interface Props extends NavigationScreenProps {
    login: (email: string, password: string) => void;
    isBusy: boolean;
}
export interface State {
    username: string;
    password: string;
}

interface FormValues {
    email: string;
    password: string;
}

class Test1 extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    render(): React.ReactNode {
        const validationSchema = yupObject().shape({
            email: yupString()
                .required('Email/Username cannot be empty'),
            password: yupString()
                .required('Password cannot be empty')
        });
        return (
            <BasicLayout blackStatusBar>
                <View style={{ paddingHorizontal: '15%', paddingVertical: '10%', flex: 1, backgroundColor: '#fff' }}>
                    {/* <Image
                        source={require('../../../assets/images/logo.png')}
                        style={{ alignSelf: 'center', marginVertical: '10%', height: 80, width: 200 }}
                        resizeMode="contain" /> */}
                    <KeyboardAvoidingView style={{ paddingVertical: 8 }}>
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={validationSchema}
                            onSubmit={(values: FormValues, formikBag: FormikActions<FormValues>) => {
                                formikBag.resetForm();
                                this.props.login(values.email, values.password);
                            }}
                        >
                            {({ handleChange,
                                handleSubmit,
                                values,
                                touched,
                                errors,
                                isSubmitting
                            }) => (
                                    <View>
                                        <TextInput
                                            value={values.email}
                                            label="Username/Email"
                                            onChangeText={handleChange('email')}
                                            error={touched.email && errors.email !== undefined}
                                        />
                                        {touched.email && errors.email &&
                                            <View style={styles.ContainerError}>
                                                <Icon name="information-circle" style={{ color: '#EA0C41', fontSize: 18, marginRight: 4 }} />
                                                <Text style={styles.TextRed}>{errors.email}</Text>
                                            </View>
                                        }
                                        <TextInput
                                            value={values.password}
                                            label="Password"
                                            onChangeText={handleChange('password')}
                                            password
                                            error={touched.password && errors.password !== undefined}

                                        />
                                        {touched.password && errors.password &&
                                            <View style={styles.ContainerError}>
                                                <Icon name="information-circle" style={{ color: '#EA0C41', fontSize: 18, marginRight: 4 }} />
                                                <Text style={styles.TextRed}>{errors.password}</Text>
                                            </View>
                                        }
                                        <Button
                                            style={{
                                                marginVertical: 12,
                                                alignSelf: 'center',
                                            }}
                                            isBusy={this.props.isBusy}
                                            onPress={handleSubmit}
                                            label="Login">
                                        </Button>
                                    </View>
                                )}
                        </Formik>
                    </KeyboardAvoidingView>
                    <View style={{ alignItems: 'center', height: 100, width: '100%' }}>
                        <TouchableOpacity
                            style={{ paddingVertical: 4, paddingHorizontal: 10 }}
                            onPress={() => {
                                this.props.navigation.navigate(ScreenNames.Register);
                            }}>
                            <TextMontserrat
                                style={{
                                    textAlign: 'center',
                                    color: '#1A2C79',
                                    alignSelf: 'flex-end',
                                    fontFamily: 'Montserrat-SemiBold'
                                }}>
                                Register a new account
                        </TextMontserrat>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ paddingVertical: 4, paddingHorizontal: 10 }}
                            onPress={() => {
                                this.props.navigation.navigate(ScreenNames.ResetPassFirstStep);
                            }}>
                            <TextMontserrat
                                style={{
                                    textAlign: 'center',
                                    color: '#1A2C79',
                                    alignSelf: 'flex-start',
                                    fontFamily: 'Montserrat-SemiBold'
                                }}>
                                Forgot password?
                        </TextMontserrat>
                        </TouchableOpacity>
                    </View>
                </View>
            </BasicLayout >
        );
    }
}
const mapState = (state: AppState) => ({
    isBusy: state.appState.isBusy
});

const mapDispatch = ({ appState, userProfile }: RematchDispatch<models>) => ({
    login: (email: string, password: string) => { userProfile.login({ email, password } as any); }
});

export default connect(mapState, mapDispatch as any)(Test1);
