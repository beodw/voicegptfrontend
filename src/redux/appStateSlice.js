import { createSlice } from '@reduxjs/toolkit';
import { saveToLocalStorage } from '../utilities';

const appState = createSlice({
  name: 'appState',
  initialState: {
    surveyModalIsVisible: false,
    recordingVideo: false,
    recordingAudio: false,
    messages: [],
    translatedSignText: '',
    submittingPrompt: false,
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
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
      saveToLocalStorage(state.messages);
    },
    setTranslatedSignText: (state, action) => {
      state.translatedSignText = action.payload;
    },
    setSubmittingPrompt: (state, action) => {
      state.submittingPrompt = action.payload;
    },
  },
});

export const { toggleSurvey, toggleAslRecording, toggleVoiceRecording, setMessages, setTranslatedSignText, setSubmittingPrompt } = appState.actions;
export const selectCounterValue = state => state.counter.value;
export default appState.reducer;
