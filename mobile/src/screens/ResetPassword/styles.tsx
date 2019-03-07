import { TextStyle, ViewStyle, ImageStyle } from 'react-native';

const Avatar: ImageStyle = {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
};

const TextRed: TextStyle = {
    color: '#EA0C41',
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 12
};

const ContainerError: ViewStyle = {
    flexDirection: 'row',
    marginLeft: 8,
    marginTop: 8,
    alignItems: 'center'
};

export default {
    Avatar,
    TextRed,
    ContainerError
};
