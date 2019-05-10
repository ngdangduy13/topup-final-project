import { ImageStyle, ViewStyle } from 'react-native';

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

const Image: ImageStyle = {
    height: 220,
    width: '100%',
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

const diameterBackButton = 55;

const CircleBack: ViewStyle = {
    height: diameterBackButton,
    width: diameterBackButton,
    borderRadius: diameterBackButton / 2,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
};

const diameterAddButton = 85;
const CircleCreate: ViewStyle = {
    height: diameterAddButton,
    width: diameterAddButton,
    borderRadius: diameterAddButton / 2,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
};
const PlayButton: ViewStyle = {
    height: diameterBackButton,
    borderRadius: diameterBackButton / 2,
    backgroundColor: '#4f91f9',
    alignItems: 'center',
    width: '40%',
    justifyContent: 'center',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowColor: '#A8A8A8',
    flexDirection: 'row'
};

const ContentContainer: ViewStyle = {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginHorizontal: 8
};

export default {
    CountContainer,
    Image,
    Footer,
    CircleBack,
    CircleCreate,
    PlayButton,
    ContentContainer
};
