import { ImageStyle, ViewStyle } from 'react-native';

const Container: ViewStyle = {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%'
};

const Button: ViewStyle = {
    width: '40%',
    marginHorizontal: 6
};

const PointContainer: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#4f91f9',
    paddingVertical: 12,
    borderRadius: 5,
    marginVertical: 12
};

export default {
    Container,
    Button,
    PointContainer
};
