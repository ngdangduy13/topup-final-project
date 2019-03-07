import { ImageStyle, ViewStyle, TextStyle } from 'react-native';
import { getLayout } from '../../helpers/get-layout';

const TextWhite: TextStyle = {
    color: '#fff',
    paddingVertical: 6,
    fontFamily: 'Montserrat-SemiBold'
};

const TextBlack: TextStyle = {
    color: '#000',
    paddingVertical: 6,
    fontFamily: 'Montserrat-SemiBold'
};

const OpenContainer: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    height: 50
};

export default {
    TextWhite,
    TextBlack,
    OpenContainer
};
