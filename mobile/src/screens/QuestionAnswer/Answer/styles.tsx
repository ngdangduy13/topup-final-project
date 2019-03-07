import { TextStyle, ViewStyle } from 'react-native';

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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0
};

const AnswerText: TextStyle = {
    color: '#fff',
    fontFamily: 'Montserrat-ExtraBold',
    textAlign: 'center'
};

const CheckIconContainer: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
    paddingLeft: 14,
    paddingTop: 12,
};

export default {
    AnswerCard,
    AnswerText,
    CheckIconContainer
};
