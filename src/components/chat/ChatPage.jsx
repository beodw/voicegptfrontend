"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Message from "./Message";
import { ArrowDownIcon, BoltIcon, ExclamationTriangleIcon, SunIcon } from "@heroicons/react/24/solid";
import {MicrophoneIcon} from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { toggleSurvey, toggleVoiceRecording, setSubmittingPrompt } from "../../redux/appStateSlice";
import { retrieveDataFromLocalStorage, storeDataInLocalStorage } from "../../lib/session";
import AslWebCam from "../Asl/AslWebCam";
import { setMessages } from "../../redux/appStateSlice";
import { getMessagesFromLocalStorage } from "../../utilities";
import { submitText } from "../../utilities";

// Key Phrases for bot to listen for.
const keyPhrases = {
    stopCommand:"hey alice stop",
    startCommand:"hey how can you help me"
};

var isSubmitting = false;
/**
 * @param {chatId<string>}
 * @returns {ReactComponentElement}
*/

// var messages = JSON.parse(localStorage.getItem("voiceGPTLocalStorage")) ?? [];
const ChatPage = ({ chatId, setListening, initSession, submittingAsl }) => {
  const messages = useSelector(s=>s.appState.messages);
  const [speechText, setSpeechText] = useState("");
  let [_, setSubmittingPromptn] = useState(false);
  // eslint-disable-next-line
  const [__, setMessagesState] = useState([])
  // eslint-disable-next-line
  let [audioContext, setAudioContext] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  const [recognitionIsInitialized, setRecognitionIsInitialized] = useState(false)

  const [isFirstVisit, setIsFirstVisit] = useState(true)

  const appState = useSelector((s)=>s.appState)
  const dispatch = useDispatch()
  
  useEffect(() => {
    const isFirstVisit = retrieveDataFromLocalStorage("isFirstVisit")
    setIsFirstVisit(isFirstVisit ?? true)
  }, [])

  const startListening = useCallback(() => {
    window.speechRecognitionObject.start();
    dispatch(toggleVoiceRecording(s=>!s.recordingAudio));
  }, [dispatch])

  const showSurvey = ()=> {
    dispatch(toggleSurvey(s=> !s.surveyModalIsVisible))
  }

  const onResult = useCallback((event) => {  
              const speechRecognitionResults = Array.from(event.results);
              
              // Check if recognition is finished
              if(!speechRecognitionResults[0].isFinal) return;

              const transcript = speechRecognitionResults.map(
                (result) => result[0].transcript
              );

              let lastDetectedText = transcript.at(-1);

              // Check if the stopCommand is detected
              if (lastDetectedText.toLocaleLowerCase().trim() === keyPhrases.stopCommand) {
                // find a way to stop audio with voice will speech synthesis is playing
                // if(audioContext) return audioContext.stop();s
                return; // stopReading();
              }

              if(isSubmitting) return; 
              // Check if the stopCommand is detected
              if (!lastDetectedText.toLocaleLowerCase().trim() === keyPhrases.startCommand) {
                  setSpeechText("How can you help me?")
                return;
              }
              else {
                  setSpeechText(lastDetectedText)
              }
              setListening(true)
              setSessionStarted(true)

              // Check if currently reading text.
              // if(isReading) return;

              // Hack to work around message being an empty [] due to closure :(.
              let messagesList = getMessagesFromLocalStorage();
              // trigger submission of text
              dispatch(setMessages([...messagesList, {isChatGpt:false, text:lastDetectedText}]));
              setSubmittingPrompt(true)

              isSubmitting = true;
    },[setListening, setSubmittingPrompt]);

  useEffect(() => {
      if(!recognitionIsInitialized){
        window.speechRecognitionObject = (new (window.SpeechRecognition ||
                                                      window.webkitSpeechRecognition)())
        window.speechRecognitionObject.onstart = () => {
              // console.log("Listening...");
        };

        window.speechRecognitionObject.interimResults = true;
        window.speechRecognitionObject.continuous = false;
        window.speechRecognitionObject.lang = "en-US";

        window.speechRecognitionObject.onend = () => {
          // console.log("Recognition ended.");
          startListening();
        };

        window.speechRecognitionObject.onerror = (event) => {
          // Find better way to handle errors.
          // console.error("Error occurred in recognition: ", event.error);
        };

        window.speechRecognitionObject.onresult = onResult;

    }
    else {
      if(appState.recordingVideo) {
         window.speechRecognitionObject.onresult = (e) => {}
      }
      else {
          window.speechRecognitionObject.onresult = onResult;
      }
    }

  }, [recognitionIsInitialized, onResult, startListening, appState]);

  const init = useCallback(() => {
      if (!window.AudioContext) {
          if (!window.webkitAudioContext) {
              alert("Your browser does not support any AudioContext and cannot play back the response!.");
              return;
          }
              window.AudioContext = window.webkitAudioContext;
          }
          audioContext = new AudioContext();
          return audioContext;
    },[])


  const playByteArray =  useCallback( (byteArray, context) => {
    var arrayBuffer = new ArrayBuffer(byteArray.length);
    var bufferView = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteArray.length; i++) {
      bufferView[i] = byteArray[i];
    }
    var source = context.createBufferSource();
    context.decodeAudioData(arrayBuffer, function(buffer) {
        source = play(buffer, source, context);
    });
    return source;
  },  []);

  useEffect(() => {
        if(speechText.trim().length === 0) return;
        submitText({prompt:speechText}).then((res) => {
            setSpeechText("");
            if(!res){
              setSubmittingPrompt(false);
              isSubmitting = false;
              alert("Check your internet connection");
              return;
            }
            if(res.status  === 504) {
                const errorMessage = "Could not reach service at the moment. Try entering or saying something else";
                alert(errorMessage);
                setSubmittingPrompt(false);
                isSubmitting = false;
                return;
            }
            res.json().then(((r) => {
              if(res.status === 500){
                const errorMessage = "Well this is embrassing! Server ran into an issue :(";
                alert(errorMessage);
                // dispatch(setMessages([...messages, {isChatGpt: true, text:'Could not get a response from server :('}]));
                setSubmittingPrompt(false);
                isSubmitting = false;
                return;
              }
              let gptResponseText = r.message.choices[0].message.content;
              dispatch(setMessages([...messages, {isChatGpt: true, text:gptResponseText}]));
              // messages = [...messages, {isChatGpt:true, text:gptResponseText}]
              // document.getElementById("response").innerText = r.message.choices[0].message.content;
              let audioSource = playByteArray(r.audio.data, init());
              audioSource.addEventListener('ended', () => {setTimeout(() => {isSubmitting = false; setListening(false);}, 2000); setSubmittingPrompt(false);});
            }));
        });
        

  }, [_,init,playByteArray, speechText, isSubmitting])

  // Play the loaded file
  function play(buf, source, context) {
      source.buffer = buf;
      // Connect to the final output node (the speakers)
      source.connect(context.destination);
      // Play immediately
      source.start(0);
      return source;
  }


  return (
    <div
      // ref={chatPageRef}
      className="h-[calc(100vh-76px)] w-full overflow-y-auto hide__scroll__bar"
    >

 <div className="w-full flex mb-12 justify-center font-bold text-4xl">Voice GPT</div>

  {!recognitionIsInitialized && (<div className="w-full justify-center flex">

      <div className="flex flex-col md:flex-row space-x-2 text-center">
        <div>
          <div className="flex flex-col items-center justify-center mb-5">
            <SunIcon className="h-8 w-8 " />
            <h2>Example</h2>
          </div>

          <div className="space-y-2">
            <p className="infoText">
              "Explain quantum computing in simple terms"
            </p>
            <p className="infoText">
              "Got any creative ideas for a 10 year {"old's"} birthday?"
            </p>
            <p className="infoText">
              "How do I make an HTTP request in Javascript?"
            </p>
          </div>
        </div>

        <div className="mt-7 md:mt-0 hidden lg:block">
          <div className="flex flex-col items-center justify-center mb-5">
            <BoltIcon className="h-8 w-8 " />
            <h2>Capabilities</h2>
          </div>

          <div className="space-y-2">
            <p className="infoText">
              Remembers what user said earlier in the conversation
            </p>
            <p className="infoText">
              Allows user to provide follow-up corrections
            </p>
            <p className="infoText">
              Trained to decline inappropriate requests
            </p>
          </div>
        </div>

        <div className="mt-7 md:mt-0 hidden lg:block">
          <div className="flex flex-col items-center justify-center mb-5">
            <ExclamationTriangleIcon className="h-8 w-8 " />
            <h2>Limitations</h2>
          </div>

          <div className="space-y-2">
            <p className="infoText">
              May occasionally generate incorrect information
            </p>
            <p className="infoText">
              May occasionally produce harmful instructions or biased content
            </p>
            <p className="infoText">
              Limited Knowledge of the world and events after 2021
            </p>
          </div>
        </div>
      </div>

  </div>)}
    
  {/* {!isFirstVisit && !recognitionIsInitialized && <div className="flex flex-col items-center w-full animate-pulse mt-8">
      <ArrowDownIcon className="h-8 w-8 mt-5 mx-auto text-white animate-bounce" />
      <button onClick={showSurvey} className="truncate w-40 chatRow">Click To Win A Reward</button>
  </div>} */}

  {!recognitionIsInitialized && (
    <div className=" ">
      <p className="mt-10 text-center text-white">
        Click the mic below to get started.
      </p>
      {isFirstVisit && !recognitionIsInitialized && <ArrowDownIcon className="h-8 w-8 mt-5 mx-auto text-white animate-bounce" />}
      <div className="w-full flex justify-center">
        <MicrophoneIcon onClick={()=> {      
          startListening();
          setRecognitionIsInitialized(true)
          initSession(true)
          storeDataInLocalStorage("isFirstVisit", false)
        }
      } className="text-white w-[48px] h-[48px] hover:cursor-pointer border rounded-full p-2"/>
      </div>
    </div>
  )}

  { 
    appState.recordingVideo && 
          <AslWebCam />
  }



      {recognitionIsInitialized && messages.map((message, index) => {
        return (
          <Message
            key={index}
            message={message.text}
            isChatGpt={message.isChatGpt}
            sessionStarted={sessionStarted}
            isLastMessage={index === messages.length - 1
            }
          />
        );
      })}
    </div>
  );
};

export default ChatPage;
