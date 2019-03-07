import { Text, TouchableOpacity, Image, Modal } from 'react-native';
import React from 'react';
import BasicLayout from '../../components/BasicLayout';
import styles from './styles';
import { H1, View, Item, Input } from 'native-base';
import { NavigationScreenProps, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import serviceProvider from '../../services/service.provider';
import { AppState } from '../../store/state';
import navigation from '../../store/models/navigation';
import { RematchDispatch } from '@rematch/core';
import { models } from '../../store';
import { connect } from 'react-redux';
import ScreenNames from '../screen-names';
import config from '../../config';
import TextMontserrat from '../../components/TextMontserrat';
import { UserInfo } from '../../store/models/user-profile/interface';
import Button from '../../components/Button';
import ImagePicker from 'react-native-image-picker';
import ModalWarning from '../../components/ModalWarning';
import FastImage from 'react-native-fast-image';
import SpinKit from 'react-native-spinkit';

export interface UserProfileProps extends NavigationScreenProps {
    updateCurrentRoute: (name: string) => void;
    logout: () => void;
    resetPassword: (email: string) => void;
    uploadImage: (uri: string) => void;
    updateUser: (fullName: string) => void;
    userProfile: UserInfo;
    isUploadingImage: boolean;
}

export interface State {
    coverUrl: any;
    isEditing: boolean;
    newName: string;
}
class UserProfile extends React.Component<UserProfileProps, State> {

    // tslint:disable-next-line:no-shadowed-variable
    static navigationOptions: any = ({ navigation }: { navigation: any }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Profile',
            headerLeft: (
                <TouchableOpacity onPress={params.onBack} style={{ padding: 12 }}>
                    <Icon name="md-arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
            ),
            headerRight: (
                <View></View>
            ),
        };
    };
    constructor(props: any) {
        super(props);
        this.state = {
            coverUrl: this.props.userProfile.profileImgUrl ? `${config().hostUrl}${config().imageUrl}${this.props.userProfile.profileImgUrl}` : '',
            isEditing: false,
            newName: ''
        };
    }

    componentDidMount(): any {
        this.props.navigation.setParams({
            onBack: this.onBack,
        });
    }

    onBack = () => {
        if (!this.props.isUploadingImage) {
            this.props.updateCurrentRoute(ScreenNames.Discovery);
            this.props.navigation.navigate(ScreenNames.Discovery, { profileImgUrl: this.props.userProfile.profileImgUrl });
        }
    }

    onChangeAvatar = () => {
        const options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (!response.didCancel && !response.error && !response.customButton) {
                const coverUrl = 'data:image/jpeg;base64,' + response.data;
                this.setState(
                    {
                        coverUrl
                    },
                    () => this.props.uploadImage(response.uri)
                );
            }
        });
    }

    onEditing = () => {
        this.setState({
            isEditing: true
        });
    }

    onChangeName = () => {
        this.props.updateUser(this.state.newName);
        this.setState({
            isEditing: false
        });
    }

    render(): JSX.Element {
        const { userProfile } = this.props;
        return (
            <BasicLayout>
                <View style={{ paddingHorizontal: 10 }}>
                    <View style={styles.AvatarContainer}>
                        <TouchableOpacity style={styles.Avatar} onPress={this.onChangeAvatar}>
                            <FastImage
                                source={this.state.coverUrl !== ''
                                    ? { uri: this.state.coverUrl }
                                    : require('../../../assets/images/avatar.png')}
                                style={{ ...styles.Avatar, opacity: this.props.isUploadingImage ? 0.3 : 1 }} />
                            {this.props.isUploadingImage &&
                                <SpinKit
                                    size={25}
                                    color="#666666"
                                    style={styles.SpinKit}
                                    type="Wave"
                                />}
                        </TouchableOpacity>
                        <TextMontserrat style={{ fontFamily: 'Montserrat-SemiBold' }}>{userProfile.username}</TextMontserrat>
                    </View>
                    <View>
                        <TextMontserrat style={{ fontFamily: 'Montserrat-ExtraBold', fontSize: 16, paddingVertical: 6 }}>PROFILE</TextMontserrat>
                        <View style={{ backgroundColor: '#D6D6D6', paddingVertical: 8, borderRadius: 5, paddingHorizontal: 10 }}>
                            <View style={styles.Row}>
                                <TextMontserrat style={styles.CategoryNameText}>Fullname: </TextMontserrat>
                                <TextMontserrat>{userProfile.fullName}</TextMontserrat>
                                <Button
                                    onPress={this.onEditing}
                                    style={{ height: 20, width: 60, marginLeft: 8 }}
                                    label="Edit" />
                            </View>
                            <View style={styles.Row}>
                                <TextMontserrat style={styles.CategoryNameText}>Email: </TextMontserrat>
                                <TextMontserrat>{userProfile.email}</TextMontserrat>
                            </View>
                            <View style={styles.Row}>
                                <TextMontserrat style={styles.CategoryNameText}>Total score: </TextMontserrat>
                                <TextMontserrat>{userProfile.scorePoint}</TextMontserrat>
                            </View>
                            <View style={styles.Row}>
                                <TextMontserrat style={styles.CategoryNameText}>Total reward point: </TextMontserrat>
                                <TextMontserrat>{userProfile.rewardPoint}</TextMontserrat>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 16 }}>
                        <TextMontserrat style={{ fontFamily: 'Montserrat-ExtraBold', fontSize: 16, paddingVertical: 6 }}>GENERAL</TextMontserrat>
                        <View style={{ backgroundColor: '#D6D6D6', paddingVertical: 8, borderRadius: 5, paddingHorizontal: 10 }}>
                            <View style={styles.Row}>
                                <TextMontserrat style={styles.CategoryNameText}>Version: </TextMontserrat>
                                <TextMontserrat>0.1.0</TextMontserrat>
                            </View>
                            <View style={styles.Row}>
                                <TextMontserrat style={styles.CategoryNameText}>Term and Conditions </TextMontserrat>
                            </View>
                            <View style={styles.Row}>
                                <TextMontserrat style={styles.CategoryNameText}>Privacy Policy</TextMontserrat>
                            </View>
                            <View style={styles.Row}>
                                <TextMontserrat style={styles.CategoryNameText}>FAQ</TextMontserrat>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.LogoutButton} onPress={this.props.logout}>
                        <TextMontserrat style={{ color: '#fff', fontFamily: 'Montserrat-ExtraBold' }}>Logout</TextMontserrat>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="fade"
                    visible={this.state.isEditing}
                    transparent={true}>
                    <ModalWarning
                        title="Edit full name"
                        content={
                            <Item >
                                <Input
                                    placeholder="Full name"
                                    style={{ fontFamily: 'Montserrat-Regular', fontSize: 14 }}
                                    onChangeText={(newName: string) => this.setState({ newName })} />
                            </Item>
                        }
                        onYes={this.onChangeName}
                        onBlur={() => this.setState({ isEditing: false })} />
                </Modal>
            </BasicLayout >
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    userProfile: state.userProfile,
    isUploadingImage: state.appState.isUploadingImage
});

// tslint:disable-next-line:no-shadowed-variable
const mapDispatchToProps = ({ navigation, userProfile, quizzes }: RematchDispatch<models>) => ({
    updateCurrentRoute: (name: string) => { navigation.updateCurrentRoute(name as any); },
    logout: () => { userProfile.logout('' as any); },
    uploadImage: (uri: string) => { userProfile.uploadImage({ uri } as any); },
    updateUser: (fullName: string) => { userProfile.updateUser({ fullName } as any); },
});

export default connect(mapStateToProps, mapDispatchToProps as any)(UserProfile);
