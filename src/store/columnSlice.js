import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hsk_level: true,
  traditional: true,
  simplified: true,
  pinyin: true,
  english: true,
};

const columnSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    toggleColumn: (state, action) => {
      const columnKey = action.payload;
      if (columnKey in state) {
        state[columnKey] = !state[columnKey];
      }
    },
  },
});

export const { toggleColumn } = columnSlice.actions;
export default columnSlice.reducer;
