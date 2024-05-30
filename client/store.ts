import { configureStore } from '@reduxjs/toolkit';
import sampleReducer from './slice';

const store = configureStore({
  reducer: {
    sample: sampleReducer,
  },
});

export default store;
