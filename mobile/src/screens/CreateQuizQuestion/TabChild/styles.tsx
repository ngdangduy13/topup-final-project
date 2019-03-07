import { ImageStyle, ViewStyle, TextStyle } from 'react-native';
import { getLayout } from '../../../helpers/get-layout';

const HeaderText: TextStyle = {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff'
};

const Container: ViewStyle = {
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    // backgroundColor: config().backgroundColor,
    // paddingHorizontal: '3%',
    paddingTop: 8,
    flex: 1
};

const InputItem: any = {
    backgroundColor: '#fff',
    fontSize: 14,
    height: 40,
    alignContent: 'center',
};

const EmptyAnswerCard: ViewStyle = {
    width: '47%',
    height: '86%',
    marginHorizontal: '1%',
    marginVertical: '2%',
};

const AnswerCard: any = {
    width: '47%',
    height: '86%',
    backgroundColor: '#ef0430',
    marginHorizontal: '1%',
    marginVertical: '2%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    color: '#fff',
    textAlign: 'center',
    flexWrap: 'wrap',
    textAlignVertical: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0
};

const AnswerText: TextStyle = {
    color: '#fff',
    fontFamily: 'Montserrat-ExtraBold',
    textAlign: 'center'
};

const AnswerTextContainer: ViewStyle = {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
};

const CreateQuestion: ViewStyle = {
    paddingHorizontal: 8,
    width: '23%',
    backgroundColor: '#4f91f9',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70
};

const Image: ImageStyle = {
    width: '80%',
    height: 43
};

const FooterItem: ViewStyle = {
    width: 80,
    margin: 4,
    backgroundColor: '#fff',
    height: 62,
    padding: 2,
    alignItems: 'center',
};

const ImageContainer: ViewStyle = {
    width: getLayout().deviceWidth - 16,
    marginVertical: 12,
    height: 100,
    // flexDirection: 'row'
};

const TitleText: TextStyle = {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 4
};

const diameter = 20;

const IsCorrectIconContainer: ViewStyle = {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: diameter,
    height: diameter,
    borderRadius: diameter / 2,
    backgroundColor: '#5FCC50',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#5FCC50'
};

const SpinKit: ViewStyle = {
    position: 'absolute',
    top: getLayout().deviceWidth * 9 / 16 / 2,
    left: getLayout().deviceWidth / 2 - 20
};

const ImageCover: ImageStyle = {
    height: getLayout().deviceWidth * 9 / 16,
    width: getLayout().deviceWidth,
};

const ImagePickerContainer: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
};

export default {
    HeaderText,
    Container,
    InputItem,
    AnswerCard,
    CreateQuestion,
    Image,
    FooterItem,
    ImageContainer,
    TitleText,
    AnswerText,
    EmptyAnswerCard,
    AnswerTextContainer,
    IsCorrectIconContainer,
    SpinKit,
    ImageCover,
    ImagePickerContainer
};
