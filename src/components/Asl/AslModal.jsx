import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { nextFrame } from "@tensorflow/tfjs";
import {writeTranslation} from "../../utilities"; 
import Message from "../chat/Message";

function AslModal() {
    const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let aslToTextContainer = null;

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
    //   console.log(obj)

      const boxes = await obj[1].array()
      const classes = await obj[2].array()
      const scores = await obj[4].array()


      const traslatedText = writeTranslation(boxes[0], classes[0], scores[0], 0.8, aslToTextContainer);
      
     if (traslatedText) aslToTextContainer.innerHTML =  aslToTextContainer.innerHTML + " " + traslatedText;

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)

    }
  };

  useEffect(()=>{runCoco()},[]);

  useEffect(()=>{
   aslToTextContainer = document.getElementById('translated-asl-textarea');
  },[]);

  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <div className='w-4/5 h-4/5 bg-[#202123] rounded-lg p-4 flex flex-col items-center justify-between'>
            <div id='asl-video-container' className='grow max-h-[250px] flex justify-center w-full bg-red-500 mb-5 rounded-lg overflow-clip'>
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
                        width: 400,
                        height: 300,
                    }}
                />
            </div>
            <div className='text-white grow mb-2 asl-response-container border-gray-700 border rounded-lg max-h-[120px] hide__scroll__bar w-full text-justify p-4 flex flex-col overflow-y-scroll text-wrap'>
                {/* {
                Array(95).fill(0).map(()=><div className='flex mb-2'>
                    <div className='rounded-full w-[32px] h-[32px] bg-red-500 flex justify-center items-center mx-2'>pp</div>
                    <p className='w-full text-justify italic font-thin'> {
                        Array(95).fill(0).map(()=> <>Lorem Ipsum</>)
                    }</p>
                </div>)
                } */}
                {
                    Array(20).fill(0).map((e, index)=>(
                          <Message
            key={index}
            message={`${Array(95).fill(0).map(()=>'Lorem Ipsum')}`}
            isChatGpt={false}
            // chatRef={chatPageRef}
            sessionStarted={true}
            isLastMessage={true
              // index + 1 === messages.docs.length &&
              // message.data().user.avatar === "ChatGptIcon" &&
              // isMessageNew(message.data().createdAt)
            }
          />
                    ))
                }
            </div>
            <textarea id="translated-asl-textarea" className="text-white font-thin italic bg-transparent text-wrap w-full overflow-x-clip overflow-y-scroll border-gray-700 border rounded-lg max-h-[120px] hide__scroll__bar text-justify p-4 flex justify-center outline-none">
            </textarea>
            <div className='w-full flex justify-end mt-2'>
                <button className='bg-green-500 rounded-lg text-white flex justify-center items-center py-2 px-4'>
                    <span>Submit</span>
                </button>
            </div>
        </div>
    </div>
  )
}

export default AslModal
