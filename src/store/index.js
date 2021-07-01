// https://github.com/reduxjs/redux-toolkit/blob/2afd0f9/docs/usage/usage-with-typescript.md
import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import {rootReducer} from "./modules";

function createStore(preloadedState) {
  return configureStore({
    preloadedState,
    reducer: rootReducer,
    // ignore warning
    // https://github.com/rt2zz/redux-persist/issues/988
    middleware: getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
    // devTools: process.env.NODE_ENV === "development",
  });
}

export const store = createStore();
