import Bootstrap from './src/boot/bootstrap';
import codePush from 'react-native-code-push';
// fix warning temporarily
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);
YellowBox.ignoreWarnings(['Module RCTImageLoader requires main queue']);

export default codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_START })(Bootstrap);
