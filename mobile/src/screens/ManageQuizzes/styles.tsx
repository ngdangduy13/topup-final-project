import { ImageStyle, ViewStyle, TextStyle } from 'react-native';
import { getLayout } from '../../helpers/get-layout';
import config from '../../config';

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

const TextContainer: ViewStyle = {
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: '65%',
    borderWidth: 1,
    borderColor: '#000',
    borderLeftWidth: 0
};

const TitleText: TextStyle = {
    fontSize: 16,
    paddingVertical: 4,
    fontFamily: 'Montserrat-SemiBold'
};

const diameterBackButton = 45;

const CircleBack: ViewStyle = {
    height: diameterBackButton,
    width: diameterBackButton,
    borderRadius: diameterBackButton / 2,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowColor: '#A8A8A8'
};

const Footer: ViewStyle = {
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
    bottom: 14,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 22
};

const TopBar: ViewStyle = {
    width: getLayout().deviceWidth,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingBottom: 12,
    backgroundColor: config().primaryColor,
    alignSelf: 'center'
};

const HeaderText: TextStyle = {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat-Regular',
    color: '#fff'
};

const TopBarText: TextStyle = {
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    fontSize: 12
};

const TopBarItem: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
};

const diameterIcon = 35;

const CircleIcon: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    height: diameterIcon,
    width: diameterIcon,
    borderRadius: diameterIcon / 2,
    backgroundColor: '#fff',
    marginVertical: 4
};

const CreateButton: ViewStyle = {
    height: diameterBackButton,
    borderRadius: diameterBackButton / 2,
    backgroundColor: '#4f91f9',
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'center',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowColor: '#A8A8A8'
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
    TextContainer,
    TitleText,
    CircleBack,
    Footer,
    TopBar,
    HeaderText,
    TopBarText,
    TopBarItem,
    CircleIcon,
    CreateButton,
    CountContainer
};
