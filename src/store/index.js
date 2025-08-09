import { configureStore } from "@reduxjs/toolkit";
import columnReducer from "./columnSlice";

export const store = configureStore({
  reducer: {
    columns: columnReducer,
  },
});
