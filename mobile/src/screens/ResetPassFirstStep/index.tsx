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
import { object as yupObject, string as yupString } from 'yup';

export interface Props extends NavigationScreenProps {
    forgotPassword: (email: string) => void;
    isBusy: boolean;
}
export interface State {
    email: string;
}

interface FormValues {
    email: string;
}

class ResetPassword extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
        };
    }

    render(): React.ReactNode {

        const validationSchema = yupObject().shape({
            email: yupString()
                .email('Email is not in correct form')
                .required('Email/Username cannot be empty'),
        });
        return (
            <BasicLayout blackStatusBar>
                <View style={{ paddingHorizontal: '15%', paddingVertical: '25%', flex: 1, backgroundColor: '#fff' }}>
                    {/* <IconFontAweSome size={80} name="diamond" color="#000" style={{ alignSelf: 'center', marginBottom: 12 }} /> */}
                    <View>
                        <TextMontserrat styles={{ paddingVertical: 16 }}>Please input your email to send the token</TextMontserrat>
                        <Formik
                            initialValues={{ email: '', }}
                            validationSchema={validationSchema}
                            onSubmit={(values: FormValues, formikBag: FormikActions<FormValues>) => {
                                formikBag.resetForm();
                                this.props.forgotPassword(values.email);
                            }}
                        >
                            {({ handleChange,
                                handleSubmit,
                                values,
                                touched,
                                errors,
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
                                        <Button
                                            style={{
                                                marginVertical: 12,
                                                alignSelf: 'center',
                                            }}
                                            isBusy={this.props.isBusy}
                                            onPress={handleSubmit}
                                            label="Send">
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
    forgotPassword: (email: string) => { userProfile.forgotPassword(email as any); },
});

export default connect(mapState, mapDispatch as any)(ResetPassword);
