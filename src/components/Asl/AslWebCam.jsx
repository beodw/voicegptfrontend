import React, {useRef, useEffect, useCallback, useState } from 'react'
import Webcam from 'react-webcam';
import * as tf from "@tensorflow/tfjs";
import { getMessagesFromLocalStorage, writeTranslation} from '../../utilities';
import { useDispatch, useSelector } from "react-redux";
import { setMessages, setTranslatedSignText} from '../../redux/appStateSlice';
import { StopIcon } from '@heroicons/react/24/solid';

var textTranslatedSoFar = '';
// work around to remove sign transcription only on unmount. Fix later.
var isMounted = false;

function AslWebCam() {
  const messages = useSelector(s=>s.appState.messages); 
  const dispatch = useDispatch();
  const webcamRef = useRef(null);
  let aslToTextContainer = null;

  const addNewMessage = (newMessage) => {
     dispatch(setMessages([...messages, {isChatGpt:false, text: newMessage} ]));
  }
  const updateNewMessage = (newMessage) => {
    dispatch(setMessages([...messages, {isChatGpt:false, text: newMessage} ]));
  }

  const setTextTranslatedSoFar = (textTranslatedSoFar) => {
    dispatch(setTranslatedSignText(textTranslatedSoFar));
  }

 const appState = useSelector((s)=>s.appState)

  // Remove last message if translated text is ''.
  useEffect(() => {
    return ()=> {
      dispatch(setTranslatedSignText(''));
      textTranslatedSoFar = '';
      isMounted = !isMounted;
      if(isMounted) {return;}
      const msgs = getMessagesFromLocalStorage();
      if(msgs.at(-1).isChatGpt) return;
      dispatch(setMessages([...msgs.slice(0, -1)]));
    };
  }, []);

 

   // Main function
  const runCoco = async () => {
    // 3. TODO - Load network 
    // e.g. const net = await cocossd.load();
    // https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json
    const net = await tf.loadGraphModel('https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json')
    
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 16.7 * 100);
  };

  const detect = useCallback(async (net) => {
    if(appState.submittingPrompt) return;
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [640,480])
      const casted = resized.cast('int32')
      const expanded = casted.expandDims(0)
      const obj = await net.executeAsync(expanded)

      const boxes = await obj[1].array()
      const classes = await obj[2].array()
      const scores = await obj[4].array()


      const translatedText = writeTranslation(boxes[0], classes[0], scores[0], 0.8, aslToTextContainer);

      if (translatedText){
        if(textTranslatedSoFar.length > 0){
            textTranslatedSoFar = textTranslatedSoFar + ' ' + translatedText;
            setTextTranslatedSoFar(textTranslatedSoFar);
            updateNewMessage(textTranslatedSoFar);
        }
        else{
            // Create new message for transcribed text
            textTranslatedSoFar = translatedText;
            setTextTranslatedSoFar(textTranslatedSoFar);
            addNewMessage(textTranslatedSoFar);

        }
      }

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)

    }
  }, [textTranslatedSoFar, appState]);

  useEffect(()=>{runCoco(); 
    setTimeout(()=> document.getElementById('webcam-footage-container').classList.add('-translate-x-full'), 200); 
},[]);

// useEffect(() => {
//         if(speechText.trim().length === 0) return;
//         submitText({prompt:speechText}).then((res) => {
//             setSpeechText("");
//             if(!res){
//               setIsSubmitting(false);
//               isSubmitting = false;
//               alert("Check your internet connection");
//               return;
//             }
//             if(res.status  === 504) {
//                 const errorMessage = "Could not reach service at the moment. Try entering or saying something else";
//                 alert(errorMessage);
//                 setIsSubmitting(false);
//                 isSubmitting = false;
//                 return;
//             }
//             res.json().then(((r) => {
//               if(res.status === 500){
//                 const errorMessage = "Well this is embrassing! Server ran into an issue :(";
//                 alert(errorMessage);
//                 setMessages([...messages, {isChatGpt: true, text:'Could not get a response from server :('}])
//                 setIsSubmitting(false);
//                 isSubmitting = false;
//                 return;
//               }
//               let gptResponseText = r.message.choices[0].message.content;
//               setMessages([...messages, {isChatGpt: true, text:gptResponseText}])
//               messages = [...messages, {isChatGpt:true, text:gptResponseText}]
//               // document.getElementById("response").innerText = r.message.choices[0].message.content;
//               saveToLocalStorage(messages);
//               let audioSource = playByteArray(r.audio.data, init());
//               audioSource.addEventListener('ended', () => {setTimeout(() => {isSubmitting = false; setListening(false);}, 2000); setIsSubmitting(false);});
//             }));
//         });

//   }, [isSubmitting, messages])


  return (
    <>
      {
          false ? (<div id='webcam-footage-container' className="bg-primary transition duration-300 absolute bottom-12 right-[-100px] z-30 flex justify-center items-center overflow-hidden rounded-full w-[100px] h-[70px]">
            {/* work around to have video recorded to work with tf code. Refactor later.*/ }
              <Webcam
                      ref={webcamRef}
                      muted={true} 
                      style={{
                          position: "relative",
                          marginLeft: "0px",
                          marginRight: "0px",
                          left: 0,
                          right: 0,
                          textAlign: "center",
                          zindex: 9,
                          width: 500,
                          height: 500
                      }}
              />
        </div>)
        :
        (<div className="flex flex-col justify-center items-center p-8 bottom-0 right-0 absolute">
            <div>Generated Signing</div>
            <div className="bg-red-500 rounded-full h-12 w-12 h-[32px] w-[32px] flex justify-center items-center shadow hover:cursor-pointer z-30" onClick={()=> alert("Video Stopped")}>
              <StopIcon className='w-4 h-4'/>
            </div>
        </div>)
      }
    </>
  )
}

export default AslWebCam
