import { configureStore } from '@reduxjs/toolkit';

import rootSaga, { sagaMiddleware } from './sagas';
import { rootReducer } from './slices';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // AuthActions.login.type,
        ],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type ReduxState = ReturnType<typeof store.getState>

export default store;
