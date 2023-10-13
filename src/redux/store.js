import { configureStore } from '@reduxjs/toolkit';
import appState from './appStateSlice';
import thunk from 'redux-thunk';

const store = configureStore({
  reducer: {
    appState: appState,
  },
  middleware:[thunk]
});

export default store;