import { createSlice } from '@reduxjs/toolkit';

const appState = createSlice({
  name: 'appState',
  initialState: {
    surveyModalIsVisible: false,
  },
  reducers: {
    toggleSurvey: state => {
      state.surveyModalIsVisible = !state.surveyModalIsVisible;
    }
  },
});

export const { toggleSurvey } = appState.actions;
export const selectCounterValue = state => state.counter.value;
export default appState.reducer;
