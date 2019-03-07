import React from 'react';
import { Animated, View, Text, Image, FlatList, TouchableOpacity, Modal } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { AppState } from '../../../store/state';
import { models } from '../../../store';
import BasicLayout from '../../../components/BasicLayout';
import moment from 'moment';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenNames from '../../screen-names';
import { Card, CardItem, Body, Left, Tabs, Tab, Item, Input, Spinner } from 'native-base';
import TextMontserrat from '../../../components/TextMontserrat';
import config from '../../../config';
import { GeneralQuiz, EndList } from '../../../store/models/quizzes/interface';
import Svg, {
    Circle,
    Rect,
} from 'react-native-svg';
import ContentLoader from 'rn-content-loader';
import { getLayout } from '../../../helpers/get-layout';
import ModalWarning from '../../../components/ModalWarning';
import FastImage from 'react-native-fast-image';

export interface Props {
    updateCurrentRoute: (name: string) => void;
    getQuizById: (id: string, isForCreate: boolean) => void;
    deleteQuiz: (payload: { id: string, index: number }) => void;
    findQuizzes: (value: string, pageIndex: number, isLoadMore: boolean, state: string) => void;
    activateQuiz: (value: string) => void;
    getAllQuizzes: (state: string, isLoadMore: boolean) => void;
    isBusy: boolean;
    data: GeneralQuiz[];
    dataSearch: GeneralQuiz[];
    navigation: any;
    quizState: string;
    isLoadingMore: boolean;
    endOfList: EndList;
}
export interface State {
    activeState: number;
    isDeleting: boolean;
    itemForDeleting: { id: string, index: number, state: string };
    isFocus: boolean;
    isRestore: boolean;
    searchText: string;
    pageIndex: number;
    itemForRestore: string;
}

class DatePicker extends React.Component<Props, State> {
    static navigationOptions: any = ({ navigation }: { navigation: any }) => ({
        title: 'Manage Quizz',
        headerStyle: {
            backgroundColor: config().primaryColor,
            height: 60,
            borderBottomWidth: 0,
            elevation: 0,
            shadowColor: 'transparent',
        },
        headerLeft: (
            <View></View>
        ),
        headerRight: (
            <View></View>
        ),
    });
    timeout: any;
    timeoutForLoadingMore: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            activeState: 0,
            isDeleting: false,
            itemForDeleting: {
                id: '',
                index: 0,
                state: '',
            },
            isFocus: false,
            isRestore: false,
            searchText: '',
            pageIndex: 1,
            itemForRestore: ''
        };
    }

    renderQuestionRow = ({ item, index }: { item: GeneralQuiz, index: number }) => {
        const onDetail = () => {
            this.props.updateCurrentRoute(ScreenNames.CreateQuiz);
            this.props.navigation.navigate(ScreenNames.CreateQuiz, { currentState: item.state, isEditing : true });
            this.props.getQuizById(item._id, true);
        };
        const onDelete = () => {
            this.setState({
                isDeleting: true,
                itemForDeleting: { id: item._id, index, state: item.state }
            });
        };
        const onRestore = () => {
            this.setState({
                isRestore: true,
                itemForRestore: item._id
            });
        };
        return (
            <TouchableOpacity
                style={styles.ImageContainer}
                onPress={onDetail}
                key={index}>
                <View style={{ width: '35%', height: '100%' }}>
                    <FastImage source={item.coverImageUrl === ''
                        ? require('../../../../assets/images/background.jpg')
                        : { uri: item.coverImageUrl }} style={styles.Image} borderRadius={2} />
                    <View style={styles.CountContainer}>
                        <TextMontserrat style={{ color: '#fff', fontFamily: 'Montserrat-ExtraBold', fontSize: 12 }}>
                            {item.questionCount} Qs
                        </TextMontserrat>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={this.props.quizState === config().quizState.removed ? onRestore : onDelete}
                    style={{ zIndex: 2, position: 'absolute', bottom: 8, right: 12, padding: 6 }}>
                    <Icon name={this.props.quizState === config().quizState.removed ? 'md-refresh-circle' : 'md-trash'} size={20} color="#ddd"
                        style={{}} />
                </TouchableOpacity>
                <View style={{ paddingVertical: 4, width: '65%', paddingHorizontal: 8, backgroundColor: '#fff', borderRadius: 5 }}>
                    <TextMontserrat style={styles.TitleText} numberOfLines={1}>{item.title}</TextMontserrat>
                    <TextMontserrat style={{ paddingBottom: 12, fontSize: 12, color: '#B8B8B8' }}>
                        Created At: {moment((item as any).createAt).format('MMM Do YYYY')}
                    </TextMontserrat>
                </View>
            </TouchableOpacity>
        );
    }

    onBack = () => {
        this.props.updateCurrentRoute(ScreenNames.Discovery);
        this.props.navigation.navigate(ScreenNames.Discovery);
    }

    onCreate = () => {
        this.props.updateCurrentRoute(ScreenNames.CreateQuiz);
        this.props.navigation.navigate(ScreenNames.CreateQuiz);
    }

    onDelete = () => {
        this.props.deleteQuiz(this.state.itemForDeleting);
        this.setState(
            {
                isDeleting: false,
                itemForDeleting: {
                    id: '',
                    index: 0,
                    state: ''
                }
            }
        );
    }

    onFocus = () => {
        this.setState({
            isFocus: true
        });
    }

    onBlur = () => {
        this.setState({
            isFocus: false
        });
    }

    clearSearchText = () => {
        this.onChangeTextDelayed('', 200);
    }

    onRestore = () => {
        this.props.activateQuiz(this.state.itemForRestore);
        this.setState(
            {
                isRestore: false,
                itemForRestore: ''
            }
        );
    }

    onChangeTextDelayed = (searchText: string, wait: number) => {
        this.setState({
            pageIndex: 1
        });

        const executeFunction = () => {
            this.setState(
                {
                    searchText
                },
                () => this.props.findQuizzes(searchText, this.state.pageIndex, false, this.props.quizState)
            );
        };

        clearTimeout(this.timeout);
        this.timeout = setTimeout(executeFunction, wait);
    };

    onReachEndFlatlist = (wait: number) => {
        const endOfList = this.state.searchText === ''
            ? (this.props.endOfList as any)[this.props.quizState]
            : this.props.endOfList.SEARCHED;
        if (!this.props.isLoadingMore && !endOfList) {
            const executeFunction = () => {
                this.props.getAllQuizzes(this.props.quizState, true);
            };

            clearTimeout(this.timeoutForLoadingMore);
            this.timeoutForLoadingMore = setTimeout(executeFunction, wait);
        }
    };

    renderFooterFlatlist = () => {
        const endOfList = this.state.searchText === ''
            ? (this.props.endOfList as any)[this.props.quizState]
            : this.props.endOfList.SEARCHED;
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                {endOfList
                    ? <TextMontserrat>Out of quizzes</TextMontserrat>
                    : this.props.isLoadingMore && <Spinner color={config().primaryColor} />}
            </View>
        );
    }

    render(): React.ReactNode {
        return (
            <BasicLayout styles={{ backgroundColor: '#FAFAFA' }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Item rounded style={{
                        backgroundColor: '#fff',
                        paddingHorizontal: 6, height: 40,
                        marginVertical: 10, marginLeft: 10,
                        marginRight: 10,
                    }}>
                        <Input
                            placeholder="Search"
                            style={{ fontSize: 14, flex: 1, fontFamily: 'Montserrat-Regular', }}
                            onChangeText={(text) => this.onChangeTextDelayed(text, 200)}
                            value={this.state.searchText}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur} />
                        {this.state.isFocus &&
                            <TouchableOpacity
                                onPress={this.clearSearchText}
                                style={{ right: 12, bottom: 0, position: 'absolute', paddingHorizontal: 10 }}>
                                <Icon name="ios-close"
                                    size={30}
                                    style={{ color: '#636363' }} />
                            </TouchableOpacity>}
                    </Item>
                    {this.props.isBusy
                        ? <ContentLoader
                            rtl
                            style={{ backgroundColor: '#fafafa' }}
                            height={300}
                            width={getLayout().deviceWidth}
                            speed={3}
                            primaryColor="#f3f3f3"
                            secondaryColor="#ecebeb"
                        >
                            <Rect x="152" y="16.23" rx="3" ry="3" width="150.99" height="10.06" />
                            <Rect x="154.56" y="37.61" rx="3" ry="3" width="70.99" height="8.06" />
                            <Rect x="10" y="11.61" rx="3" ry="3" width="130" height="100" />
                            <Rect x="10" y="128.61" rx="3" ry="3" width="130" height="100" />
                            <Rect x="152.56" y="131.61" rx="3" ry="3" width="150.99" height="10.06" />
                            <Rect x="154.56" y="153.61" rx="3" ry="3" width="70.99" height="8.06" />
                        </ContentLoader>

                        : <View style={{ flex: 1 }}>
                            <FlatList
                                style={{ paddingHorizontal: 8, marginBottom: 20 }}
                                data={this.state.searchText === '' ? this.props.data : this.props.dataSearch}
                                renderItem={this.renderQuestionRow}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReachedThreshold={0}
                                onScroll={() => this.onReachEndFlatlist(200)}
                                ListFooterComponent={this.renderFooterFlatlist}
                            // bounces={false}

                            />
                            {/* <TouchableOpacity onPress={this.onLoadMore} style={{ paddingTop: 8, paddingBottom: 16, alignSelf: 'center' }}>
                                <TextMontserrat>Load more</TextMontserrat>

                            </TouchableOpacity> */}
                        </View>
                    }

                </View>
                <Modal
                    animationType="fade"
                    visible={this.state.isDeleting}
                    transparent={true}>
                    <ModalWarning
                        content={<TextMontserrat>Are you sure want to delete this quiz?</TextMontserrat>}
                        onYes={this.onDelete}
                        onBlur={() => this.setState({ isDeleting: false, itemForDeleting: { id: '', index: 0, state: '' } })} />
                </Modal>
                <Modal
                    animationType="fade"
                    visible={this.state.isRestore}
                    transparent={true}>
                    <ModalWarning
                        content={<TextMontserrat>Are you sure want to restore this quiz?</TextMontserrat>}
                        onYes={this.onRestore}
                        onBlur={() => this.setState({ isRestore: false, itemForRestore: '' })} />
                </Modal>
            </BasicLayout >
        );
    }
}
const mapState = (state: AppState) => ({

});

const mapDispatch = ({ navigation, quizzes }: RematchDispatch<models>) => ({

});

export default connect(mapState, mapDispatch as any)(DatePicker);
