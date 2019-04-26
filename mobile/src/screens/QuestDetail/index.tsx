import {
  Text,
  View,
  Image,
  TouchableOpacity,
  InteractionManager
} from "react-native";
import React from "react";
import { NavigationScreenProps, NavigationActions } from "react-navigation";
import { AppState } from "../../store/state";
import { RematchDispatch } from "@rematch/core";
import { models } from "../../store";
import { connect } from "react-redux";
import styles from "./styles";
import BasicLayout from "../../components/BasicLayout";
import { Button, Grid, Col } from "native-base";
import config from "../../config";
import Icon from "react-native-vector-icons/Ionicons";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import serviceProvider from "../../services/service.provider";
import ScreenNames from "../screen-names";
import TextMontserrat from "../../components/TextMontserrat";
import { SingleQuiz } from "../../store/models/quizzes/interface";
import Svg, { Circle, Rect } from "react-native-svg";
import ContentLoader from "rn-content-loader";
import { getLayout } from "../../helpers/get-layout";
import FastImage from "react-native-fast-image";

export interface QuestDetailProps extends NavigationScreenProps {
  updateCurrentRoute: (name: string) => void;
  getQuizById: (id: string, isForCreate: boolean) => void;
  quizIsPlaying: SingleQuiz;
  isBusy: boolean;
}

class QuestDetail extends React.Component<QuestDetailProps, any> {
  static navigationOptions: any = ({ navigation }: { navigation: any }) => ({
    header: null
  });

  constructor(props: any) {
    super(props);
  }

  onBack = () => {
    this.props.updateCurrentRoute(ScreenNames.Discovery);
    this.props.navigation.navigate(ScreenNames.Discovery);
  };

  onPlay = () => {
    this.props.updateCurrentRoute(ScreenNames.QuestionAnswer);
    this.props.navigation.navigate(ScreenNames.QuestionAnswer);
  };

  onGoScoreboard = () => {
    this.props.updateCurrentRoute(ScreenNames.QuizScoreboard);
    this.props.navigation.navigate(ScreenNames.QuizScoreboard, {});
  };
  render(): JSX.Element {
    const { quizIsPlaying } = this.props;
    console.log(quizIsPlaying);

    return (
      <BasicLayout>
        {this.props.isBusy ? (
          <ContentLoader
            rtl
            height={400}
            width={getLayout().deviceWidth}
            speed={3}
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
            style={{ backgroundColor: "#fff" }}
          >
            <Rect
              x="21.56"
              y="17.61"
              rx="2"
              ry="2"
              width={getLayout().deviceWidth}
              height="150"
            />
            <Rect x="21.56" y="184.61" rx="8" ry="8" width="277" height="17" />
            <Rect x="21.56" y="215.61" rx="8" ry="8" width="201" height="13" />
          </ContentLoader>
        ) : (
          <View style={{ flex: 1, width: "100%" }}>
            <View>
              <FastImage
                source={{
                  uri: `http://localhost:3003${quizIsPlaying.coverImageUrl}`
                }}
                style={styles.Image}
                resizeMode="cover"
              />
              <View style={styles.CountContainer}>
                <TextMontserrat
                  style={{
                    color: "#fff",
                    fontFamily: "Montserrat-ExtraBold",
                    fontSize: 12
                  }}
                >
                  {quizIsPlaying.questionCount} Questions
                </TextMontserrat>
              </View>
            </View>
            <View style={styles.ContentContainer}>
              <TextMontserrat
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: 17,
                  padding: 10
                }}
              >
                {quizIsPlaying.title}
              </TextMontserrat>
            </View>
            <View style={styles.ContentContainer}>
              <TextMontserrat
                style={{ fontFamily: "Montserrat-SemiBold", padding: 10 }}
              >
                Description
              </TextMontserrat>
              <TextMontserrat style={{ fontSize: 14, paddingLeft: 10 }}>
                {quizIsPlaying.description}
              </TextMontserrat>
            </View>
          </View>
        )}
        <View style={styles.Footer}>
          <TouchableOpacity style={styles.CircleBack} onPress={this.onBack}>
            <Icon name="ios-arrow-back" size={17} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.PlayButton} onPress={this.onPlay}>
            <IconFontAwesome
              name="play"
              size={22}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                fontFamily: "Montserrat-ExtraBold",
                color: "#fff",
                fontSize: 17
              }}
            >
              Play
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.CircleBack}
            onPress={this.onGoScoreboard}
          >
            <Icon name="md-stats" size={17} color="#000" />
          </TouchableOpacity>
        </View>
      </BasicLayout>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  quizIsPlaying: state.quizzes.quizIsPlaying,
  isBusy: state.appState.isBusy
});

const mapDispatchToProps = ({
  navigation,
  quizzes
}: RematchDispatch<models>) => ({
  updateCurrentRoute: (name: string) =>
    navigation.updateCurrentRoute(name as any),
  getQuizById: (id: string, isForCreate: boolean) => {
    quizzes.getQuizById({ id, isForCreate } as any);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps as any
)(QuestDetail);
