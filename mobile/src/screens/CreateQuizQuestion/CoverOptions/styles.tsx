import { ViewStyle, ImageStyle, TextStyle } from 'react-native';
import config from '../../../config';
import { getLayout } from '../../../helpers/get-layout';

const Container: ViewStyle = {
    backgroundColor: config().backgroundColor,
};

const WhiteBox: ViewStyle = {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 12,
    // alignItems: 'center',
    width: getLayout().deviceWidth - 50,
    borderRadius: 5,
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
    paddingVertical: 8,
    paddingHorizontal: 8
};

export default {
    Container,
    WhiteBox,
    Box,
    Row,
};
