import { init } from '@rematch/core';
import selectPlugin from '@rematch/select';
import models from './models';
import createRematchPersist from '@rematch/persist';
import storage from 'redux-persist/lib/storage';
import { AppState } from './state';
import { Store } from 'redux';
import { persistStore } from 'redux-persist';

let store: Store<AppState>;

const configStore = (callback?: () => void) => {
  const persistPlugin = createRematchPersist({
    whitelist: ['userProfile', 'language'],
    key: 'root',
    storage,
    throttle: 0,
    version: 5,
  } as any);

  store = init({
    models,
    plugins: [selectPlugin(), persistPlugin],
  });

  const persistor = persistStore(store, {}, callback);
  return { store, persistor };
};

export default configStore;
export { models, store };
export type models = typeof models;
