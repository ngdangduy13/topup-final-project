import { ImageStyle, ViewStyle, TextStyle } from 'react-native';
import config from '../../config';
import { getLayout } from '../../helpers/get-layout';

const HeaderText: TextStyle = {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold'
};

const Container: ViewStyle = {
    paddingTop: 8,
    flex: 1
};
const AnswerCard: any = {
    width: '48%',
    height: '94%',
    marginHorizontal: '1%',
    marginVertical: '1%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0
};

const NextButton: ViewStyle = {
    paddingHorizontal: 8,
    width: '50%',
    backgroundColor: '#4f91f9',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowColor: '#3F74C7',
};

const Image: ImageStyle = {
    width: '80%',
    flex: 1
};

const AnswerText: TextStyle = {
    color: '#fff',
    fontFamily: 'Montserrat-ExtraBold'
};

const ImageContainer: ViewStyle = {
    width: getLayout().deviceWidth - 16,
    marginVertical: 12,
    height: 100,
    // flexDirection: 'row'
};
const lineHeight = 10;

const LineContainer: ViewStyle = {
    backgroundColor: '#ddd',
    height: lineHeight,
    position: 'absolute',
    // borderRadius: 10,
    alignSelf: 'flex-start',
    width: '100%',
    bottom: 0
};

const Line: ViewStyle = {
    position: 'absolute',
    top: 0,
    backgroundColor: config().primaryColor,
    height: lineHeight,
    width: '24%',
};

export default {
    HeaderText,
    Container,
    AnswerCard,
    NextButton,
    Image,
    ImageContainer,
    LineContainer,
    AnswerText,
    Line
};
