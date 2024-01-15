"use client";

import { MicrophoneIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAslRecording, toggleVoiceRecording, toggleModality, setTranslatedSignText } from "../../redux/appStateSlice";
import { submitText } from "../../utilities";
import { setMessages } from "../../redux/appStateSlice";
const ChatInput = ({ listening }) => {

  const appState = useSelector((s)=>s.appState)
  const dispatch = useDispatch()

  const toggleModalityInput = () => {
    dispatch(toggleAslRecording(s=>!s.recordingVideo));
    dispatch(toggleVoiceRecording(s=>!s.recordingAudio));
  }

  const updateMessages = (gptResponseText) => {
    dispatch(setMessages([...appState.messages, {isChatGpt: true, text:gptResponseText}]));
    dispatch(setTranslatedSignText(''));
  }

  const submitTranslation = () => {
    if(appState.translatedSignText.length === 0) return;
      submitText({prompt:appState.translatedSignText}).then((res) => {
              if(!res){
                alert("Check your internet connection");
                return;
              }
              if(res.status  === 504) {
                  const errorMessage = "Could not reach service at the moment. Try entering or saying something else";
                  return;
              }
              res.json().then(((r) => {
                if(res.status === 500){
                  const errorMessage = "Well this is embrassing! Server ran into an issue :(";
                  alert(errorMessage);
                  return;
                }
                let gptResponseText = r.message.choices[0].message.content;
                updateMessages(gptResponseText);
              }));
      });
  }

  return (
    <div
      className="py-5 sticky w-full bottom-0 right-0 left-0 text-gray-400 text-sm flex items-center justify-center h-20"
    >

      <form
        className="bg-gray-800 justify-center rounded-2xl border border-gray-700/50 px-5 py-4 space-x-5 flex mx-auto z-50 absolute"
      >
        
           
      <div onClick={toggleModalityInput} className="border-gray-700 border chatRow">
          <p>Use {appState.recordingVideo ? 'Voice': 'Sign Lang'}</p>
      </div>
      {
        appState.recordingVideo ?
              <div onClick={submitTranslation} className="border-gray-700 border chatRow">
                  <p>{'Submit Translation'}</p>
              </div>
              :
              <p
              className="flex"
              >
                {!listening ? (<span className="flex items-center"> Try Saying Something <MicrophoneIcon className="ml-[5px] w-4 h-4" /></span>) : "Processing..."}
              </p>
        }
      </form>
    </div>
  );
};

export default ChatInput;
