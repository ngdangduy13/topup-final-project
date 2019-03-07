import React from 'react';
import { Animated, View, Text, TouchableOpacity, Switch } from 'react-native';
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
    resetPassword: (email: string, password: string, token: string) => void;
    isBusy: boolean;
}
export interface State {
    email: string;
    tokenId: string;
    confirmPassword: string;
    password: string;
}

interface FormValues {
    email: string;
    password: string;
    confirmPassword: string;
    token: string;
}

class ResetPassword extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        const tokenId = this.props.navigation.getParam('token', '');
        this.state = {
            email: '',
            tokenId,
            confirmPassword: '',
            password: ''
        };
    }

    getValidationSchema = (values: FormValues) => {
        return yupObject().shape({
            email: yupString()
                .email('Email is not in correct form')
                .required('Email is required'),
            token: yupString()
                .required('Email is required'),
            password: yupString()
                .matches(
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                    'Password must have at least one capitalize letter and one number')
                .required('Password is required'),
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
            <BasicLayout blackStatusBar>
                <View style={{ paddingHorizontal: '15%', paddingVertical: '25%', flex: 1, backgroundColor: '#fff' }}>
                    {/* <IconFontAweSome size={80} name="diamond" color="#000" style={{ alignSelf: 'center', marginBottom: 12 }} /> */}
                    <View>
                        <TextMontserrat>Please input the token send to your email and your new password</TextMontserrat>

                        <Formik
                            initialValues={{ email: '', password: '', confirmPassword: '', token: '' }}
                            validate={this.validate}
                            onSubmit={(values: FormValues, formikBag: FormikActions<FormValues>) => {
                                this.props.resetPassword(values.email, values.password, values.token);
                                formikBag.resetForm();
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
                                            value={values.token}
                                            label="Token ID"
                                            onChangeText={handleChange('token')}
                                            error={touched.token && errors.token !== undefined}
                                        />
                                        {touched.token && errors.token &&
                                            <View style={styles.ContainerError}>
                                                <Icon name="information-circle" style={{ color: '#EA0C41', fontSize: 18, marginRight: 4 }} />
                                                <Text style={styles.TextRed}>{errors.token}</Text>
                                            </View>
                                        }
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
                                        <Button
                                            style={{
                                                marginVertical: 12,
                                                alignSelf: 'center',
                                            }}
                                            onPress={handleSubmit}
                                            isBusy={this.props.isBusy}
                                            label="Reset">
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
                </View>
            </BasicLayout>

        );
    }
}
const mapState = (state: AppState) => ({
    isBusy: state.appState.isBusy
});

const mapDispatch = ({ appState, userProfile }: RematchDispatch<models>) => ({
    resetPassword: (email: string, password: string, token: string) => { userProfile.resetPassword({ email, password, token } as any); }
});

export default connect(mapState, mapDispatch as any)(ResetPassword);
