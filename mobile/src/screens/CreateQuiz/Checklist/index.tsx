import * as React from 'react';
import styles from './styles';
import { Text, View, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getLayout } from '../../../helpers/get-layout';
import TextMontserrat from '../../../components/TextMontserrat';
import config from '../../../config';

export interface Props {
    onBlur: () => void;
    isHavingCoverImage: boolean;
    isHavingTitle: boolean;
    isHaveDescription: boolean;
    isFullRequirementQuestion: boolean;
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
                    <TextMontserrat style={{ fontWeight: 'bold' }}>Checklist</TextMontserrat>
                    {/* <View style={styles.LineContainer}>
                        <View style={[styles.Line, { width: '50%' }]}></View>
                    </View> */}
                </View>

                <View style={styles.WhiteBox}>
                    <View style={{ backgroundColor: '#F6F9F5', paddingVertical: 8, marginHorizontal: 8, borderRadius: 5 }}>
                        <View style={styles.Row}>
                            <Icon
                                name={this.props.isHavingCoverImage ? 'ios-checkmark-circle' : 'ios-alert'}
                                size={30}
                                color={this.props.isHavingCoverImage ? '#1F7A29' : '#f2244a'}
                                style={{ marginHorizontal: 8 }} />
                            <TextMontserrat style={{ fontFamily: 'Montserrat-SemiBold' }}>Add cover image</TextMontserrat>
                        </View>
                        <View style={styles.Row}>
                            <Icon
                                name={this.props.isHavingTitle ? 'ios-checkmark-circle' : 'ios-alert'}
                                size={30}
                                color={this.props.isHavingTitle ? '#1F7A29' : '#f2244a'}
                                style={{ marginHorizontal: 8 }} />
                            <TextMontserrat style={{ fontFamily: 'Montserrat-SemiBold' }}>Add a title</TextMontserrat>
                        </View>
                        <View style={styles.Row}>
                            <Icon
                                name={this.props.isHaveDescription ? 'ios-checkmark-circle' : 'ios-alert'}
                                size={30}
                                color={this.props.isHaveDescription ? '#1F7A29' : '#f2244a'}
                                style={{ marginHorizontal: 8 }} />
                            <TextMontserrat style={{ fontFamily: 'Montserrat-SemiBold' }}>Add a description</TextMontserrat>
                        </View>
                        <View style={styles.Row}>
                            <Icon
                                name={this.props.isFullRequirementQuestion ? 'ios-checkmark-circle' : 'ios-alert'}
                                size={30}
                                color={this.props.isFullRequirementQuestion ? '#1F7A29' : '#f2244a'}
                                style={{ marginHorizontal: 8 }} />
                            <TextMontserrat style={{ flexWrap: 'wrap', fontFamily: 'Montserrat-SemiBold' }}>
                                Make sure your questions are completed
                            </TextMontserrat>
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
