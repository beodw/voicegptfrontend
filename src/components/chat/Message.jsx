// import { DocumentData } from "firebase/firestore";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { ChatGptIcon } from "../../lib/icons";
import myPic from "../../assets/myPic.png";
// import Image from "next/image";


const Message = ({ message, isChatGpt, isLastMessage, sessionStarted}) => {

  const textBoxRef = useRef(null);
  const [_message, setMessage] = useState(message);

  useEffect(()=>{
    typeEffect(message, 25);
  },[message]);

  // Typing Effect
  function typeEffect(text, delay) {

    let i = 0;
    if(isLastMessage && sessionStarted){
        const typeInterval = setInterval(() => {

        if (i <= text.length) {

        // console.log(text.substring(0, i));
        // let messageDiv = document.getElementById("messageDiv");
        if(textBoxRef && textBoxRef.current){
            textBoxRef.current.innerText = text.substring(0, i)
        }

        i++;

        } else {

        clearInterval(typeInterval);

        }

        }, delay);
    }else {
        textBoxRef.current.innerText = text;
      }

  }

  return (
    <div
      className={`py-7 text-white ${isChatGpt && "bg-[#434654]"}`}
    >
      <div className="flex px-3 sm:px-10 space-x-5 max-w-[700px] mx-auto">
        {isChatGpt ? (
          <span className="">
            <ChatGptIcon class="h-8 w-8" />
          </span>
        ) : (
          <>
          {/* <Image width={48}  height={48} alt="" src={"/../../assets/myPic.png"} /> */}
            <img
              className="h-8 w-8 object-cover rounded-full"
              src={myPic}
              width="300" height="200"
              alt={'user' + "'s" + " avatar"}
            />
          </>
        )}

        <div className="overflow-hidden text-justify">
          {/* {message.split("\n").map((text: string, index: number) =>
            text ? (
              <p key={index} className="pb-3 text-sm message h-auto">
                {text}
              </p>
            ) : (
              <></>
            )
          )} */}

          <span ref={textBoxRef}></span>
        </div>
        
{/* 
        {last && (
          <div className="overflow-hidden">
            {_message.split("\n").map((text: string, index: number) =>
              text ? (
                <p key={index} className="pb-3 text-sm message">
                  {text}

                  {_message.split("\n").length === index + 1 && (
                    <span className="h-5 blink w-5 bg-gray-400 translate-y-[3px]"></span>
                  )}
                </p>
              ) : (
                <></>
              )
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Message;
