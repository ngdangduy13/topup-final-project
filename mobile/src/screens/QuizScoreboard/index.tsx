import React from 'react';
import { Animated, View, Text, Image, FlatList, StatusBar, TouchableOpacity, InteractionManager } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { AppState } from '../../store/state';
import { models } from '../../store';
import BasicLayout from '../../components/BasicLayout';
import styles from './styles';
import { getLayout } from '../../helpers/get-layout';
import ScreenNames from '../screen-names';
import config from '../../config';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScoreboardItem } from '../../store/models/scoreboard/interface';
import Svg, {
    Circle,
    Rect,
} from 'react-native-svg';
import ContentLoader from 'rn-content-loader';
import { SingleQuiz } from '../../store/models/quizzes/interface';

export interface Props extends NavigationScreenProps {
    updateCurrentRoute: (name: string) => void;
    getQuizScoreboard: (value: string) => void;
    quizScoreboard: ScoreboardItem[];
    isBusy: boolean;
    quizIsPlaying: SingleQuiz;
}
export interface State {
    isReady: boolean;
}

class ScoreBoard extends React.Component<Props, State> {
    static navigationOptions: any = ({ navigation }: { navigation: any }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Quiz Scoreboard',
            headerLeft: (
                <TouchableOpacity style={{ padding: 16 }} onPress={() => params.onBack()}>
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
            isReady: false
        };
    }

    componentDidMount(): void {
        this.props.navigation.setParams({
            onBack: this.onBack
        });
        // InteractionManager.runAfterInteractions(() => {
        this.props.getQuizScoreboard(this.props.quizIsPlaying._id);
        // });
    }

    onBack = () => {
        this.props.updateCurrentRoute(ScreenNames.Discovery);
        this.props.navigation.navigate(ScreenNames.Discovery);
    }

    renderScoreBoard = ({ item, index }: { item: ScoreboardItem, index: number }) => {
        const diameter = 35;
        return (
            <View style={{
                flexDirection: 'row',
                width: '100%',
                paddingHorizontal: 18,
                paddingVertical: 8,
                alignItems: 'center', justifyContent: 'center'
            }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View
                        style={{
                            height: diameter, width: diameter, borderRadius: diameter / 2,
                            backgroundColor: '#4180AD', alignItems: 'center', justifyContent: 'center'
                        }}>
                        <Text style={!item.isCurrentUser
                            ? { ...styles.TextContainer, color: '#58ACE9' }
                            : { ...styles.TextContainer, color: '#fff' }}>{index + 1}</Text>
                    </View>
                    <Image
                        source={item.profileImgUrl !== undefined
                            ? { uri: `${config().hostUrl}${config().imageUrl}${item.profileImgUrl}` }
                            : require('../../../assets/images/avatar.png')}
                        style={{ height: diameter, width: diameter, marginLeft: 8 }} borderRadius={diameter / 2} />
                    <View style={{ paddingHorizontal: 8 }}>
                        <Text style={!item.isCurrentUser ? styles.TextContainer : { ...styles.TextContainer, color: '#6E6E6E' }}>
                            {item.username}
                        </Text>
                    </View>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={!item.isCurrentUser ? styles.TextContainer : { ...styles.TextContainer, color: '#6E6E6E' }}>{item.points}</Text>
                </View>
            </View>
        );
    }

    render(): React.ReactNode {
        return (
            <BasicLayout styles={{ backgroundColor: config().backgroundColor }}>
                <View style={{ paddingTop: 12, alignItems: 'center', flex: 1, marginTop: 10 }}>
                    {this.props.isBusy
                        ? <ContentLoader
                            height={160}
                            width={getLayout().deviceWidth}
                            speed={2}
                            primaryColor="#f3f3f3"
                            secondaryColor="#ecebeb"
                        >
                            <Circle cx="26" cy="29" r="18" />
                            <Circle cx="70" cy="29" r="18" />
                            <Rect x="100.56" y="24" rx="5" ry="5" width="200" height="11" />
                            <Rect x="310.56" y="24" rx="5" ry="5" width="43" height="11" />
                            <Circle cx="26" cy="79" r="18" />
                            <Circle cx="70" cy="79" r="18" />
                            <Rect x="100.56" y="74" rx="5" ry="5" width="200" height="11" />
                            <Rect x="310.56" y="74" rx="5" ry="5" width="43" height="11" />
                            <Circle cx="26" cy="129" r="18" />
                            <Circle cx="70" cy="129" r="18" />
                            <Rect x="100.56" y="124" rx="5" ry="5" width="200" height="11" />
                            <Rect x="310.56" y="124" rx="5" ry="5" width="43" height="11" />
                        </ContentLoader>
                        : <FlatList
                            data={this.props.quizScoreboard}
                            style={{ width: '100%', marginBottom: 10, flex: 1 }}
                            renderItem={this.renderScoreBoard}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    }
                </View>
            </BasicLayout>
        );
    }
}
const mapState = (state: AppState) => ({
    quizScoreboard: state.scoreboard.quizScoreboard,
    isBusy: state.appState.isBusy,
    quizIsPlaying: state.quizzes.quizIsPlaying
});

const mapDispatch = ({ navigation, scoreboard }: RematchDispatch<models>) => ({
    updateCurrentRoute: (name: string) => navigation.updateCurrentRoute(name as any),
    getQuizScoreboard: (value: string) => scoreboard.getQuizScoreboard(value as any),
});

export default connect(mapState, mapDispatch as any)(ScoreBoard);
