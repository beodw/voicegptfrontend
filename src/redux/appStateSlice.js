import { createSlice } from '@reduxjs/toolkit';

const appState = createSlice({
  name: 'appState',
  initialState: {
    surveyModalIsVisible: false,
    recordingVideo: false,
  },
  reducers: {
    toggleSurvey: state => {
      state.surveyModalIsVisible = !state.surveyModalIsVisible;
    },
    toggleAslRecording: state => {
      state.recordingVideo = !state.recordingVideo;
    },
  },
});

export const { toggleSurvey, toggleAslRecording } = appState.actions;
export const selectCounterValue = state => state.counter.value;
export default appState.reducer;
