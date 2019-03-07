import { Container, Content } from 'native-base';
import * as React from 'react';
import styles from './styles';
import { ViewStyle, StatusBar, View, TouchableOpacity, Modal } from 'react-native';
import TextMontserrat from '../TextMontserrat';
import { getLayout } from '../../helpers/get-layout';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from '../Button';

export interface Props {
    content: any;
    onBlur?: () => void;
    onYes?: () => void;
    title?: string;
    noButton?: boolean;
}
export interface State { }
class ModalWarning extends React.Component<Props, State> {
    render(): React.ReactNode {
        return (
            <View style={{
                width: getLayout().deviceWidth,
                height: getLayout().deviceHeight,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
                <View style={{ backgroundColor: '#fff', borderRadius: 5 }}>
                    <View style={styles.TitleContainer}>
                        <TextMontserrat style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 18 }}>
                            {this.props.title ? this.props.title : 'Warning'}
                        </TextMontserrat>
                    </View>
                    <View style={styles.WhiteBox}>
                        <View style={{ backgroundColor: '#F6F9F5', paddingVertical: 8, marginHorizontal: 8, borderRadius: 5 }}>
                            <View style={styles.Row}>
                                {this.props.content}
                            </View>
                        </View>
                        {!this.props.noButton &&
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                paddingVertical: 12,
                                paddingHorizontal: '10%'
                            }}>
                                <Button
                                    style={{ width: '40%' }}
                                    label="No"
                                    onPress={this.props.onBlur} />
                                <Button
                                    style={{ width: '40%' }}
                                    label="Yes"
                                    onPress={this.props.onYes} />
                            </View>}

                    </View>
                </View>

            </View>
        );
    }
}

export default ModalWarning;
