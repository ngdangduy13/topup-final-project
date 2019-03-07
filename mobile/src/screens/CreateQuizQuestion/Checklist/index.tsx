import * as React from 'react';
import styles from './styles';
import { Text, View, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getLayout } from '../../../helpers/get-layout';
import TextMontserrat from '../../../components/TextMontserrat';
import config from '../../../config';

export interface Props {
    onBlur: () => void;
    isHavingQuestion: boolean;
    isHavingCoverUrl: boolean;
}
export interface State {
}

class BasicLayout extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {

        };
    }

    render(): React.ReactNode {
        return (
            <View style={{
                width: getLayout().deviceWidth,
                height: getLayout().deviceHeight,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                zIndex: 2
            }}>
                <TouchableOpacity
                    onPress={this.props.onBlur}
                    style={{
                        width: getLayout().deviceWidth,
                        height: getLayout().deviceHeight,
                        zIndex: -1,
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}>
                </TouchableOpacity>
                <View style={styles.YellowBox}>
                    <TextMontserrat style={{ fontFamily: 'Montserrat-SemiBold' }}>Checklist</TextMontserrat>
                </View>

                <View style={styles.WhiteBox}>
                    <View style={{ backgroundColor: '#F6F9F5', paddingVertical: 8, marginHorizontal: 8, borderRadius: 5 }}>
                        <View style={styles.Row}>
                            <Icon
                                name={this.props.isHavingCoverUrl ? 'ios-checkmark-circle' : 'ios-alert'}
                                size={30}
                                color={this.props.isHavingCoverUrl ? '#1F7A29' : '#f2244a'}
                                style={{ marginHorizontal: 8 }} />
                            <TextMontserrat style={{ fontFamily: 'Montserrat-SemiBold' }}>Add cover image</TextMontserrat>
                        </View>
                        <View style={styles.Row}>
                            <Icon
                                name={this.props.isHavingQuestion ? 'ios-checkmark-circle' : 'ios-alert'}
                                size={30}
                                color={this.props.isHavingQuestion ? '#1F7A29' : '#f2244a'}
                                style={{ marginHorizontal: 8 }} />
                            <TextMontserrat style={{ fontFamily: 'Montserrat-SemiBold' }}>Add a question</TextMontserrat>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.OkButton} onPress={this.props.onBlur}>
                        <TextMontserrat
                            style={{ color: '#fff', fontFamily: 'Montserrat-ExtraBold', fontSize: 16 }}>
                            Ok
                        </TextMontserrat>
                    </TouchableOpacity>
                </View>

            </View >
        );
    }
}

export default BasicLayout;
