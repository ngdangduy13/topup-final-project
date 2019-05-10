import React from "react";
import {
  Animated,
  View,
  Text,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
  InteractionManager
} from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { RematchDispatch } from "@rematch/core";
import { AppState } from "../../store/state";
import { models } from "../../store";
import BasicLayout from "../../components/BasicLayout";
import styles from "./styles";
import { getLayout } from "../../helpers/get-layout";
import ScreenNames from "../screen-names";
import config from "../../config";
import Icon from "react-native-vector-icons/Ionicons";
import { ScoreboardItem } from "../../store/models/scoreboard/interface";
import Svg, { Circle, Rect } from "react-native-svg";
import ContentLoader from "rn-content-loader";
import {
  VoucherState,
  VoucherItem
} from "../../store/models/voucher/interface";
import TextMontserrat from "../../components/TextMontserrat";
import FastImage from "react-native-fast-image";
import { UserInfo } from "../../store/models/user-profile/interface";

export interface Props extends NavigationScreenProps {
  updateCurrentRoute: (name: string) => void;
  getVoucher: () => void;
  setSelectedVoucher: (payload: any) => void;
  voucher: VoucherState;
  isBusy: boolean;
  userProfile: UserInfo;
}
export interface State {
  isReady: boolean;
}

class ScoreBoard extends React.Component<Props, State> {
  static navigationOptions: any = ({ navigation }: { navigation: any }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Voucher",
      headerLeft: <View />,
      headerRight: <View />
    };
  };

  constructor(props: any) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  componentDidMount(): void {
    InteractionManager.runAfterInteractions(() => {
      this.props.getVoucher();
      this.props.navigation.setParams({
        onBack: this.onBack
      });
    });
  }

  onBack = () => {
    this.props.updateCurrentRoute(ScreenNames.Discovery);
    this.props.navigation.navigate(ScreenNames.Discovery);
  };

  renderScoreBoard = ({
    item,
    index
  }: {
    item: VoucherItem;
    index: number;
  }) => {
    const diameter = 35;
    const onPress = () => {
        this.props.setSelectedVoucher(item);
        this.props.updateCurrentRoute(ScreenNames.VoucherDetail);
        this.props.navigation.navigate(ScreenNames.VoucherDetail);
    }
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          width: "100%",
          paddingHorizontal: 18,
          paddingVertical: 8,
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 8
        }}
        onPress={onPress}
      >
        <Image
          source={{ uri: `http://localhost:3003${item.coverUrl}` }}
          resizeMode="contain"
          style={{ width: "40%", height: "100%" }}
        />
        <View
          style={{
            width: "60%",
            paddingBottom: 16,
            marginLeft: 12,
            borderBottomColor: "#ddd",
            borderBottomWidth: 1
          }}
        >
          <TextMontserrat
            style={{ fontFamily: "Montserrat-SemiBold", paddingBottom: 6 }}
          >
            {item.name}
          </TextMontserrat>
          <TextMontserrat style={{ paddingTop: 8, fontSize: 12 }}>
            {item.pointForExchange} points
          </TextMontserrat>
        </View>
      </TouchableOpacity>
    );
  };

  render(): React.ReactNode {
    return (
      <BasicLayout styles={{ backgroundColor: config().backgroundColor }}>
        <View
          style={{
            paddingTop: 12,
            alignItems: "center",
            flex: 1,
            marginTop: 10
          }}
        >
          {this.props.isBusy ? (
            <ContentLoader
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
          ) : (
            <FlatList
              data={this.props.voucher.all}
              style={{ width: "100%", marginBottom: 10, flex: 1 }}
              renderItem={this.renderScoreBoard}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 16
                  }}
                >
                  <FastImage
                    source={
                      this.props.userProfile.profileImgUrl !== "" &&
                      this.props.userProfile.profileImgUrl !== undefined
                        ? {
                            uri: `${config().hostUrl}${config().imageUrl}${
                              this.props.userProfile.profileImgUrl
                            }`
                          }
                        : require("../../../assets/images/avatar.png")
                    }
                    style={{ height: 70, width: 70, borderRadius: 35 }}
                  />
                  <View style={{paddingLeft: 14}}>
                    <TextMontserrat
                      style={{
                        fontFamily: "Montserrat-SemiBold",
                        paddingBottom: 10,
                        fontSize: 18
                      }}
                    >
                      {this.props.userProfile.fullName}
                    </TextMontserrat>
                    <TextMontserrat style={{ fontSize: 12 }}>
                      Reward points: {this.props.userProfile.rewardPoint} points
                    </TextMontserrat>
                  </View>
                </View>
              }
            />
          )}
        </View>
      </BasicLayout>
    );
  }
}
const mapState = (state: AppState) => ({
  voucher: state.voucher,
  isBusy: state.appState.isBusy,
  userProfile: state.userProfile
});

const mapDispatch = ({ navigation, voucher }: RematchDispatch<models>) => ({
  updateCurrentRoute: (name: string) =>
    navigation.updateCurrentRoute(name as any),
  getVoucher: () => voucher.getVoucher("" as any),
  setSelectedVoucher: (payload: any) => voucher.setSelectedVoucher(payload as any),
});

export default connect(
  mapState,
  mapDispatch as any
)(ScoreBoard);
