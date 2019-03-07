import { ImageStyle, ViewStyle, TextStyle } from 'react-native';
import config from '../../config';
import { getLayout } from '../../helpers/get-layout';

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
    // flex: 1,
    width: '100%',
    height: '100%'
};

const InputItem: any = {
    backgroundColor: '#fff',
    fontSize: 14,
    height: 40,
    alignContent: 'center',
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
    fontFamily: 'Montserrat-ExtraBold'
};

const CreateQuestion: ViewStyle = {
    paddingHorizontal: 8,
    width: '25%',
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

const diameter = 15;

const WarningIconContainer: ViewStyle = {
    position: 'absolute',
    top: 2,
    right: 2,
    width: diameter,
    height: diameter,
    borderRadius: diameter / 2,
    backgroundColor: '#f2244a',
    justifyContent: 'center',
    alignItems: 'center'
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
    WarningIconContainer
};
