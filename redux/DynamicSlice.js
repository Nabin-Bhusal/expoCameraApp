import { createSlice } from '@reduxjs/toolkit';

const dynamicSlice = createSlice({
  name: 'dynamicState',
  initialState: {}, // Starts as an empty object
  reducers: {
    updateState: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value; // Dynamically update the state based on the key
    },
    removeState: (state, action) => {
      const { key } = action.payload;
      delete state[key]; // Remove the key from the state
    },
  },
});

export const { updateState, removeState } = dynamicSlice.actions;
export default dynamicSlice.reducer;