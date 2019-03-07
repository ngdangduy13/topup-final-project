import * as React from 'react';
import styles from './styles';
import { Text, View, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getLayout } from '../../../helpers/get-layout';
import TextMontserrat from '../../../components/TextMontserrat';
import config from '../../../config';
import Button from '../../../components/Button';
import ScreenNames from '../../screen-names';

export interface Props {
    onBlur: () => void;
    onOpenLibrary: () => void;
    navigation: any;
}
export interface State {
}

class BasicLayout extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {

        };
    }

    onOpenVideo = () => {
        this.props.onBlur();
        this.props.navigation.navigate(ScreenNames.VideoTutorial);
    }

    render(): React.ReactNode {
        return (
            <View style={{
                width: getLayout().deviceWidth,
                height: getLayout().deviceHeight,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                alignItems: 'center',
                justifyContent: 'flex-end',
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
                <View style={styles.WhiteBox}>
                    <TouchableOpacity style={styles.Row} onPress={this.onOpenVideo}>
                        <Icon name="ios-film" size={30} color="#5E5E5E" style={{ marginHorizontal: 16 }} />
                        <TextMontserrat style={{ fontFamily: 'Montserrat-SemiBold' }}>Video</TextMontserrat>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Row} onPress={this.props.onOpenLibrary}>
                        <Icon name="ios-image" size={30} color="#5E5E5E" style={{ marginHorizontal: 16 }} />
                        <TextMontserrat style={{ fontFamily: 'Montserrat-SemiBold' }}>Photos</TextMontserrat>
                    </TouchableOpacity>
                </View>
                <Button
                    style={{
                        width: getLayout().deviceWidth - 50,
                        backgroundColor: '#fff',
                        shadowColor: '#ddd',
                        marginVertical: 12,
                        height: 50
                    }}
                    onPress={this.props.onBlur}
                >
                    <TextMontserrat style={{ color: '#000', fontFamily: 'Montserrat-ExtraBold' }}>Cancel</TextMontserrat>
                </Button>

            </View >
        );
    }
}

export default BasicLayout;
