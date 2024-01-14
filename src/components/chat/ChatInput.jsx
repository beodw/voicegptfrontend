"use client";

import { MicrophoneIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAslRecording, toggleVoiceRecording, toggleModality } from "../../redux/appStateSlice";


const ChatInput = ({ listening }) => {

  const appState = useSelector((s)=>s.appState)
  const dispatch = useDispatch()

  const toggleModalityInput = () => {
    // Stop listening for speech when switching to sign language
    // if(appState.recordingAudio) { window.speechRecognitionObject =  {}; }
    // else{
    //   if(!window.speechRecognitionObject.listening) {
    //     window.speechRecognitionObject = (new (window.SpeechRecognition || window.webkitSpeechRecognition)())
    //     window.speechRecognitionObject.start();
    //   }
    // }
    dispatch(toggleAslRecording(s=>!s.recordingVideo));
    dispatch(toggleVoiceRecording(s=>!s.recordingAudio));
  }

  return (
    <div
      // ref={formInputRef}
      className="py-5 sticky w-full bottom-0 right-0 left-0 text-gray-400 text-sm flex items-center justify-center h-20"
    >

      <form
        // onSubmit={sendMessage}
        className="bg-gray-800 justify-center rounded-2xl border border-gray-700/50 px-5 py-4 space-x-5 flex mx-auto z-50 absolute"
      >
        
           
      <div onClick={toggleModalityInput} className="border-gray-700 border chatRow">
          <p>Use {appState.recordingVideo ? 'Voice': 'Sign Lang'}</p>
      </div>
      {
        appState.recordingVideo ?
              <div onClick={()=>{}} className="border-gray-700 border chatRow">
                  <p>{'Submit Translation'}</p>
              </div>
              :
              <p
              className="flex"
                // value={prompt}
                // onChange={(e) => setPrompt(e.target.value)}
                // type="text"
                // placeholder="Your message will be transcribed here..."
                // className="bg-transparent focus:outline-none flex-1"
              >
                {!listening ? (<span className="flex items-center"> Try Saying Something <MicrophoneIcon className="ml-[5px] w-4 h-4" /></span>) : "Processing..."}
              </p>
        }

        {/* <button
          // disabled={!prompt || !session}
          type="submit"
          className={`bg-[#11A37f] hover:opacity-50 text-white font-bold px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          <PaperAirplaneIcon className="h-4 w-4 " />
        </button> */}
      </form>
    </div>
  );
};

export default ChatInput;
