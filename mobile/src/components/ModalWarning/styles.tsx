import { ViewStyle, ImageStyle, TextStyle } from 'react-native';
import config from '../../config';
import { getLayout } from '../../helpers/get-layout';

const Container: ViewStyle = {
    backgroundColor: config().backgroundColor,
};

const TitleContainer: ViewStyle = {
    paddingTop: 15,
    paddingHorizontal: 12,
    alignItems: 'center',
    width: getLayout().deviceWidth - 50,
};

const WhiteBox: ViewStyle = {
    paddingVertical: 15,
    paddingHorizontal: 12,
    // alignItems: 'center',
    width: getLayout().deviceWidth - 50,
};

const Box: ViewStyle = {
    backgroundColor: '#1A2C79',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 18,
    paddingVertical: 8,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    minWidth: 90,
};

const Row: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8
};
const OkButton: ViewStyle = {
    paddingHorizontal: 8,
    width: '50%',
    backgroundColor: '#4f91f9',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowColor: '#3F74C7',
    alignSelf: 'center',
    marginTop: 8
};

const lineHeight = 7;

const Line: ViewStyle = {
    position: 'absolute',
    top: 0,
    backgroundColor: '#f2244a',
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

export default {
    Container,
    TitleContainer,
    WhiteBox,
    Box,
    Row,
    OkButton,
    Line,
    LineContainer
};
