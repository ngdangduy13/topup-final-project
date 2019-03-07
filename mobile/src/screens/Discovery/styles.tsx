import { ImageStyle, ViewStyle, TextStyle } from 'react-native';
import { getLayout } from '../../helpers/get-layout';

const Image: ImageStyle = {
    height: getLayout().deviceWidth * 9 / 16,
    width: getLayout().deviceWidth,
};

const ImageContainer: ViewStyle = {
    width: '100%',
    marginVertical: 12,
    // marginHorizontal: '4%'
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 2,
    // shadowOffset: { width: 1, height: 3 },
    // shadowOpacity: 1,
    // shadowRadius: 3,
    // shadowColor: '#ddd'
};

const TextContainer: ViewStyle = {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#000',
    borderTopWidth: 0
};

const CountContainer: ViewStyle = {
    position: 'absolute',
    // borderWidth: 1,
    // borderColor: '#000',
    paddingVertical: 6,
    borderRadius: 2,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    bottom: 10,
    right: 10,
};

const TitleText: TextStyle = {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 2,
    fontFamily: 'Montserrat-SemiBold'
};

const diameterAvatar = 30;

const Avatar: ImageStyle = {
    height: diameterAvatar,
    width: diameterAvatar,
    borderRadius: diameterAvatar / 2,
};

const AvatarContainer: ViewStyle = {
    height: diameterAvatar,
    width: diameterAvatar,
    marginLeft: 12,
};

export default {
    Image,
    ImageContainer,
    TitleText,
    TextContainer,
    CountContainer,
    Avatar,
    AvatarContainer
};
