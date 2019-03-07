import firebase from 'firebase';
require('firebase/firestore');
require('firebase/auth');
require('firebase/storage');
import config from '../config';
const settings = {
    timestampsInSnapshots: true
};

const bootstrapFirebase = () => {
    if (firebase.apps.length === 0) {
        firebase.initializeApp(config().firebase);
        firebase.firestore().settings(settings);
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    }
    // debug only
    // firebase.firestore.setLogLevel('debug');
};

export default bootstrapFirebase;
