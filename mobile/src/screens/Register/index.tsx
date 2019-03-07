import React from 'react';
import { Animated, View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Item, Input, Spinner, Icon, Left, Right } from 'native-base';
import ScreenNames from '../screen-names';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { AppState } from '../../store/state';
import { models } from '../../store';
import DateTimePicker from 'react-native-modal-datetime-picker';
import config from '../../config';
import styles from './styles';
import IconFontAweSome from 'react-native-vector-icons/FontAwesome';
import Button from '../../components/Button';
import TextMontserrat from '../../components/TextMontserrat';
import TextInput from '../../components/TextInput';
import Checkbox from 'react-native-modest-checkbox';
import BasicLayout from '../../components/BasicLayout';
import { Formik, Field, FormikActions } from 'formik';
import { object as yupObject, string as yupString, bool as yupBool } from 'yup';

export interface Props extends NavigationScreenProps {
    register: (email: string, password: string, username: string, fullname: string) => void;
    isBusy: boolean;
}
export interface State {
    isCheckTerm: boolean;
}

interface FormValues {
    email: string;
    password: string;
    fullname: string;
    confirmPassword: string;
    username: string;
}

class Register extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            isCheckTerm: false
        };
    }
    getValidationSchema = (values: FormValues) => {
        return yupObject().shape({
            email: yupString()
                .email('Email is not in correct form')
                .required('Email is required'),
            username: yupString()
                .required('Username is required'),
            password: yupString()
                .matches(
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                    'Password must have at least one capitalize letter and one number')
                .required('Password is required'),
            fullname: yupString()
                .required('Required'),
            confirmPassword: yupString()
                .oneOf([values.password], 'Passwords are not the same!')
                .required('Password confirmation is required!'),
        });
    }

    getErrorsFromValidationError = (validationError: any) => {
        const FIRST_ERROR = 0;
        return validationError.inner.reduce((errors: any, error: any) => {
            return {
                ...errors,
                [error.path]: error.errors[FIRST_ERROR],
            };
            // tslint:disable-next-line:align
        }, {});
    }

    validate = (values: FormValues) => {
        const validationSchema = this.getValidationSchema(values);
        try {
            validationSchema.validateSync(values, { abortEarly: false });
            return {};
        } catch (error) {
            return this.getErrorsFromValidationError(error);
        }
    }

    render(): React.ReactNode {
        return (
            <ScrollView style={{ paddingHorizontal: '15%', backgroundColor: '#fff', }}>
                <View style={{ paddingVertical: '15%', }}>
                    <Formik
                        initialValues={{ email: '', password: '', fullname: '', confirmPassword: '', username: '' }}
                        validate={this.validate}
                        onSubmit={(values: FormValues, formikBag: FormikActions<FormValues>) => {
                            this.props.register(values.email, values.password, values.username, values.fullname);
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
                                        label="Email"
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
                                        value={values.username}
                                        label="Username"
                                        onChangeText={handleChange('username')}
                                        error={touched.username && errors.username !== undefined}
                                    />
                                    {touched.username && errors.username &&
                                        <View style={styles.ContainerError}>
                                            <Icon name="information-circle" style={{ color: '#EA0C41', fontSize: 18, marginRight: 4 }} />
                                            <Text style={styles.TextRed}>{errors.username}</Text>
                                        </View>
                                    }
                                    <TextInput
                                        value={values.fullname}
                                        label="Fullname"
                                        onChangeText={handleChange('fullname')}
                                        error={touched.fullname && errors.fullname !== undefined}
                                    />
                                    {touched.fullname && errors.fullname &&
                                        <View style={styles.ContainerError}>
                                            <Icon name="information-circle" style={{ color: '#EA0C41', fontSize: 18, marginRight: 4 }} />
                                            <Text style={styles.TextRed}>{errors.fullname}</Text>
                                        </View>
                                    }
                                    <TextInput
                                        value={values.password}
                                        label="Password"
                                        onChangeText={handleChange('password')}
                                        error={touched.password && errors.password !== undefined}
                                        password
                                    />
                                    {touched.password && errors.password &&
                                        <View style={styles.ContainerError}>
                                            <Icon name="information-circle" style={{ color: '#EA0C41', fontSize: 18, marginRight: 4 }} />
                                            <Text style={styles.TextRed}>{errors.password}</Text>
                                        </View>
                                    }
                                    <TextInput
                                        value={values.confirmPassword}
                                        label="Confirm Password"
                                        onChangeText={handleChange('confirmPassword')}
                                        error={touched.confirmPassword && errors.confirmPassword !== undefined}
                                        password
                                    />
                                    {touched.confirmPassword && errors.confirmPassword &&
                                        <View style={styles.ContainerError}>
                                            <Icon name="information-circle" style={{ color: '#EA0C41', fontSize: 18, marginRight: 4 }} />
                                            <Text style={styles.TextRed}>{errors.confirmPassword}</Text>
                                        </View>
                                    }
                                    <View style={{ flexDirection: 'row', paddingVertical: 14, left: -5 }}>
                                        <View style={{ alignSelf: 'flex-start', }}>
                                            <Checkbox
                                                label=""
                                                onChange={() => this.setState({ isCheckTerm: !this.state.isCheckTerm })}
                                                checked={this.state.isCheckTerm}
                                            />
                                        </View>
                                        <View style={{ marginLeft: -16 }}>
                                            <TextMontserrat style={{ marginHorizontal: 6, lineHeight: 25 }}>
                                                <TextMontserrat>I have read and agree with</TextMontserrat>
                                                <TextMontserrat style={{ color: '#1A2C79', fontFamily: 'Montserrat-SemiBold', }}>
                                                    {' '}TechQuiz Terms
                                                     </TextMontserrat>
                                                <TextMontserrat>{' '}and</TextMontserrat>
                                                <TextMontserrat style={{ color: '#1A2C79', fontFamily: 'Montserrat-SemiBold', }}>
                                                    {' '}Conditions and Privacy Policy
                                                    </TextMontserrat>
                                            </TextMontserrat>
                                        </View>
                                    </View>
                                    <Button
                                        style={{
                                            marginVertical: 12,
                                            alignSelf: 'center',
                                        }}
                                        onPress={handleSubmit}
                                        isBusy={this.props.isBusy}
                                        label="Register">
                                    </Button>
                                </View>
                            )}
                    </Formik>
                    <TouchableOpacity style={{ paddingTop: 8 }} onPress={() => {
                        this.props.navigation.navigate(ScreenNames.Login);
                    }}>
                        <Text style={{ textAlign: 'center', color: '#1A2C79', fontFamily: 'Montserrat-SemiBold' }}>Back to login</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        );
    }
}
const mapState = (state: AppState) => ({
    isBusy: state.appState.isBusy
});

const mapDispatch = ({ appState, userProfile }: RematchDispatch<models>) => ({
    register: (email: string, password: string, username: string, fullname: string) => {
        userProfile.register({ email, password, username, fullname } as any);
    }
});

export default connect(mapState, mapDispatch as any)(Register);
