import React, {useRef, useEffect } from 'react'
import Webcam from 'react-webcam';
import * as tf from "@tensorflow/tfjs";
import { writeTranslation } from '../../utilities';
import { useSelector } from "react-redux";


function AslWebCam() {
  const webcamRef = useRef(null);
  let aslToTextContainer = null;

  const appState = useSelector((s)=>s.appState)

   // Main function
  const runCoco = async () => {
    // 3. TODO - Load network 
    // e.g. const net = await cocossd.load();
    // https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json
    const net = await tf.loadGraphModel('https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json')
    
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 16.7);
  };

  const detect = async (net) => {
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
      console.log(aslToTextContainer,translatedText);
      
      if (translatedText) aslToTextContainer.innerHTML =  aslToTextContainer.innerHTML + " " + translatedText;

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)

    }
  };

  useEffect(()=>{runCoco(); 
    setTimeout(()=> document.getElementById('webcam-footage-container').classList.add('-translate-x-full'), 200); 
},[]);

  useEffect(()=>{
   aslToTextContainer = document.getElementById('translated-asl-textarea');
  },[appState.recordingVideo]);


  return (
     <div id='webcam-footage-container' className="bg-primary transition duration-300 absolute bottom-12 right-[-100px] z-30 flex justify-center items-center overflow-hidden rounded-full w-[100px] h-[70px]">
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
    </div>
  )
}

export default AslWebCam
