import { ImageStyle, ViewStyle, TextStyle } from 'react-native';
import { getLayout } from '../../helpers/get-layout';

const height = 100;
const Image: ImageStyle = {
    height,
    width: '100%',
};

const ImageContainer: ViewStyle = {
    width: getLayout().deviceWidth - 16,
    marginVertical: 8,
    height,
    borderRadius: 2,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd'
};

const TextInputContainer: TextStyle = {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
    color: '#424242',
    borderRadius: 15,
};

const TitleText: TextStyle = {
    fontSize: 16,
    paddingVertical: 4,
    fontFamily: 'Montserrat-SemiBold'
};

const SearchSeaction: ViewStyle = {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
};

const CountContainer: ViewStyle = {
    position: 'absolute',
    // borderWidth: 1,
    // borderColor: '#000',
    paddingVertical: 6,
    borderRadius: 2,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    bottom: 4,
    right: 4,
};

export default {
    Image,
    ImageContainer,
    SearchSeaction,
    TextInputContainer,
    CountContainer,
    TitleText
};
