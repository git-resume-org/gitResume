import { configureStore } from "@reduxjs/toolkit";
import sampleReducer from './slice.js';

const store = configureStore({
  reducer: {
    sample: sampleReducer,
  }
});

export default store;
