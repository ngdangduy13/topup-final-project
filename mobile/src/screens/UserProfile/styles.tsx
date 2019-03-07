import { ImageStyle, ViewStyle, TextStyle } from 'react-native';

const TextContainer: TextStyle = {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 20,
    // borderWidth: 1,
    // borderColor: '#000',
    // borderTopWidth: 0
};
const ViewContainer: ViewStyle = {
    marginHorizontal: 14,
    // marginVertical: 40,
    borderWidth: 1,
    borderColor: '#000',
    height: 30,
};
const TextCenterContainer: TextStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
    padding: 5,
};

const HeaderText: TextStyle = {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff'
};

const diameterAvatar = 75;

const AvatarContainer: ViewStyle = {
    // height: diameterAvatar,
    // width: diameterAvatar,
    // borderRadius: diameterAvatar / 2,
    alignSelf: 'center',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
};

const Avatar: ImageStyle = {
    height: diameterAvatar,
    width: diameterAvatar,
    borderRadius: diameterAvatar / 2,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center'
};

const Row: ViewStyle = {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
    // borderBottomWidth: 1,
    // borderBottomColor: '#B0B0B0',
};

const CategoryNameText: TextStyle = {
    fontFamily: 'Montserrat-SemiBold'
};

const LogoutButton: ViewStyle = {
    paddingHorizontal: 8,
    width: '50%',
    backgroundColor: '#4f91f9',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowColor: '#3F74C7',
    alignSelf: 'center',
    marginTop: 18
};

const SpinKit: ViewStyle = {
    position: 'absolute',
    // top: 10,
    // left: 10
};

export default {
    TextContainer,
    ViewContainer,
    TextCenterContainer,
    HeaderText,
    AvatarContainer,
    Avatar,
    Row,
    CategoryNameText,
    LogoutButton,
    SpinKit
};
