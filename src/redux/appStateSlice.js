import { createSlice } from '@reduxjs/toolkit';

const appState = createSlice({
  name: 'appState',
  initialState: {
    surveyModalIsVisible: false,
    aslModalIsVisible: false,
  },
  reducers: {
    toggleSurvey: state => {
      state.surveyModalIsVisible = !state.surveyModalIsVisible;
    },
    toggleAslModal: state => {
      state.aslModalIsVisible = !state.aslModalIsVisible;
    },
  },
});

export const { toggleSurvey, toggleAslModal } = appState.actions;
export const selectCounterValue = state => state.counter.value;
export default appState.reducer;
