/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React from 'react';
import { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { StyleProvider, Root, FooterTab } from 'native-base';
import codePush from 'react-native-code-push';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { getPersistor } from '@rematch/persist';
import { Provider } from 'react-redux';
import getTheme from '../native-base-theme/components';
import AppNavigator from './app-navigator';
import bootstrapFirebase from './bootstrap-firebase';
import i18next from '../helpers/i18next';
import { I18nextProvider } from 'react-i18next';
import { Store } from 'redux';
import { AppState } from '../store/state';
import SplashScreen from 'react-native-splash-screen';
import firebase from 'react-native-firebase';
import configStore from '../store';
import { Persistor } from 'redux-persist';
import ScreenNames from '../screens/screen-names';

interface Props { }

interface State {
    store: Store<AppState>;
    persistor: Persistor;
}
class App extends Component<Props, State> {
    constructor(props: any) {
        super(props);
        const { store, persistor } = configStore(() => this.proceedTaskAfterStoreLoadAsync(store));
        this.state = {
            store,
            persistor
        };
    }

    async proceedTaskAfterStoreLoadAsync(store: Store<AppState>): Promise<void> {
        // Set language
        const state = store.getState();
        if (state.language && state.language.language) {
            i18next.changeLanguage(state.language.language);
        }
        // Get device token for pushing notification
        SplashScreen.hide();

        await this.getDeviceToken();

    }

    getDeviceToken = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            const token = await firebase.messaging().getToken();
            firebase.firestore().collection('deviceTokens').doc(token).set({});
        } else {
            try {
                await firebase.messaging().requestPermission();
                const token = await firebase.messaging().getToken();
                firebase.firestore().collection('deviceTokens').doc(token).set({});
            } catch (err) {
                // tslint:disable-next-line:no-console
                console.log(err);
            }
        }
    }

    render(): React.ReactNode {
        const visibleFooterScreen: any[] = [
            ScreenNames.Discovery,
            ScreenNames.Scoreboard
        ];

        return (
            <StyleProvider style={getTheme()}>
                <I18nextProvider i18n={i18next}>
                    <PersistGate persistor={this.state.persistor}>
                        <Provider store={this.state.store}>
                            <AppNavigator />
                        </Provider>
                    </PersistGate>
                </I18nextProvider>
            </StyleProvider>
        );
    }
}

export default (App);
