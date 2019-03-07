import { TextStyle, ViewStyle, ImageStyle } from 'react-native';

const TextRed: TextStyle = {
    color: '#EA0C41',
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular'
};

const ContainerError: ViewStyle = {
    flexDirection: 'row',
    marginLeft: 8,
    marginTop: 8,
    alignItems: 'center'
};

export default {
    TextRed,
    ContainerError
};
