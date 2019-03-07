import { ImageStyle, ViewStyle, TextStyle } from 'react-native';
import config from '../../config';
import { getLayout } from '../../helpers/get-layout';

const HeaderText: TextStyle = {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat-Regular',
    color: '#fff'
};

const TitleText: TextStyle = {
    fontSize: 14,
    paddingLeft: 4,
    paddingBottom: 4,
    // justifyContent: 'flex-start'
};

const Container: ViewStyle = {
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    // backgroundColor: config().backgroundColor,
    paddingHorizontal: '4%',
    paddingVertical: 20,
    paddingBottom: '10%'
};

const lineHeight = 7;

const Line: ViewStyle = {
    position: 'absolute',
    top: 0,
    backgroundColor: '#fff',
    height: lineHeight,
    width: '24%',
    borderRadius: 10
};

const LineContainer: ViewStyle = {
    backgroundColor: '#ddd',
    height: lineHeight,
    position: 'relative',
    borderRadius: 10,
    marginTop: 6,
    width: getLayout().deviceWidth / 2
};

const StateItemContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center'
};

const InputItem: any = {
    backgroundColor: '#fff',
    fontSize: 14,
    height: 40
};

const InputBeaconContainer: ViewStyle = {
    marginTop: 8
};

const CreateQuestion: ViewStyle = {
    position: 'absolute',
    bottom: 14,
    right: 14,
    flexDirection: 'row',
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#4f91f9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowColor: '#ddd'
};

const ImageQuestion: ImageStyle = {
    width: '30%',
    height: 75,
    margin: 8,
    marginTop: 0
};

const ImageCover: ImageStyle = {
    height: getLayout().deviceWidth * 9 / 16,
};

const CardContainer: ViewStyle = {
    // width: getLayout().deviceWidth - 10,
    marginVertical: 4,
    // flexDirection: 'row'
};

const diameter = 25;

const WarningIconContainer: ViewStyle = {
    position: 'absolute',
    top: 14,
    right: 14,
    width: diameter,
    height: diameter,
    borderRadius: diameter / 2,
    backgroundColor: '#f2244a',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5
};

const SpinKit: ViewStyle = {
    position: 'absolute',
    top: getLayout().deviceWidth * 9 / 16 / 2 - 20,
    left: getLayout().deviceWidth / 2 - 40
};

const PickImageContainer: ViewStyle = {
    width: '100%',
    height: getLayout().deviceWidth * 9 / 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 2
};

export default {
    HeaderText,
    Line,
    LineContainer,
    Container,
    TitleText,
    StateItemContainer,
    InputItem,
    InputBeaconContainer,
    CreateQuestion,
    CardContainer,
    ImageQuestion,
    ImageCover,
    WarningIconContainer,
    SpinKit,
    PickImageContainer
};
