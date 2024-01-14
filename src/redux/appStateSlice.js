import { createSlice } from '@reduxjs/toolkit';

const appState = createSlice({
  name: 'appState',
  initialState: {
    surveyModalIsVisible: false,
    recordingVideo: false,
    recordingAudio: false,
  },
  reducers: {
    toggleSurvey: state => {
      state.surveyModalIsVisible = !state.surveyModalIsVisible;
    },
    toggleAslRecording: state => {
      state.recordingVideo = !state.recordingVideo;
    },
    toggleVoiceRecording: state => {
      state.recordingAudio = !state.recordingAudio;
    }
  },
});

export const { toggleSurvey, toggleAslRecording, toggleVoiceRecording, toggleModality } = appState.actions;
export const selectCounterValue = state => state.counter.value;
export default appState.reducer;
