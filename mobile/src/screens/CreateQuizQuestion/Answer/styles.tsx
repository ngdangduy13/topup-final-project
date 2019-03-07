import { ViewStyle, ImageStyle, TextStyle } from 'react-native';
import config from '../../../config';
import { getLayout } from '../../../helpers/get-layout';

const Container: ViewStyle = {
    backgroundColor: config().backgroundColor,
};

const AnswerCard: any = {
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

const AnswerText: TextStyle = {
    color: '#fff',
    fontFamily: 'Montserrat-ExtraBold',
    textAlign: 'center'
};

const diameter = 50;

const Circle: ViewStyle = {
    height: diameter,
    width: diameter,
    borderRadius: diameter / 2,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center'
};

export default {
    Container,
    AnswerCard,
    AnswerText,
    Circle
};
