import {
  Text,
  View,
  Image,
  TouchableOpacity,
  InteractionManager,
  ScrollView
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
import {
  VoucherItem,
  VoucherState
} from "../../store/models/voucher/interface";
import Modal from "react-native-modal";

export interface QuestDetailProps extends NavigationScreenProps {
  updateCurrentRoute: (name: string) => void;
  exchangeVoucher: () => void;
  exchangeSuccessfully: (payload: boolean) => void;
  selectedVoucher: VoucherItem;
  isBusy: boolean;
  voucher: VoucherState;
}

class QuestDetail extends React.Component<QuestDetailProps, any> {
  static navigationOptions: any = ({ navigation }: { navigation: any }) => ({
    header: null
  });

  constructor(props: any) {
    super(props);
  }

  onBack = () => {
    this.props.updateCurrentRoute(ScreenNames.Voucher);
    this.props.navigation.navigate(ScreenNames.Voucher);
  };

  exchange = () => {
    this.props.exchangeVoucher();
  };

  render(): JSX.Element {
    const { selectedVoucher } = this.props;

    return (
      // <BasicLayout>
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <View style={{ width: "100%", paddingBottom: 80 }}>
          <View>
            <FastImage
              source={{
                uri: `http://localhost:3003${selectedVoucher.coverUrl}`
              }}
              style={styles.Image}
              resizeMode="cover"
            />
          </View>
          <View style={styles.ContentContainer}>
            <TextMontserrat
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: 17,
                padding: 10
              }}
            >
              {selectedVoucher.name}
            </TextMontserrat>
          </View>
          <View style={styles.ContentContainer}>
            <TextMontserrat
              style={{ fontFamily: "Montserrat-SemiBold", padding: 10 }}
            >
              Description
            </TextMontserrat>
            <TextMontserrat style={{ fontSize: 14, paddingLeft: 10 }}>
              {selectedVoucher.description}
            </TextMontserrat>
          </View>
        </View>
        <View style={styles.Footer}>
          <TouchableOpacity style={styles.CircleBack} onPress={this.onBack}>
            <Icon name="ios-arrow-back" size={17} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.PlayButton} onPress={this.exchange}>
            <Text
              style={{
                fontFamily: "Montserrat-ExtraBold",
                color: "#fff",
                fontSize: 17
              }}
            >
              Exchange
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          isVisible={this.props.voucher.isVisible}
          onBackdropPress={() => this.props.exchangeSuccessfully(false)}
        >
          <View style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', paddingBottom: 12, borderRadius: 2 }}>
            <TextMontserrat style={{paddingVertical: 12, fontFamily: 'Montserrat-SemiBold', fontSize: 22}}>Notice</TextMontserrat>

            <TextMontserrat>
              Your code to discount is{" "}
              <TextMontserrat>{this.props.selectedVoucher.code}</TextMontserrat>
            </TextMontserrat>
          </View>
        </Modal>
      </ScrollView>
      // </BasicLayout>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  selectedVoucher: state.voucher.selectedVoucher,
  isBusy: state.appState.isBusy,
  voucher: state.voucher
});

const mapDispatchToProps = ({
  navigation,
  voucher
}: RematchDispatch<models>) => ({
  updateCurrentRoute: (name: string) =>
    navigation.updateCurrentRoute(name as any),
  exchangeVoucher: () => {
    voucher.exchangeVoucher("" as any);
  },
  exchangeSuccessfully: (payload: boolean) => {
    voucher.exchangeSuccessfully(payload as any);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps as any
)(QuestDetail);
