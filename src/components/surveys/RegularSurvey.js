import React, { useRef, useState } from 'react'

function RegularSurvey() {
    let questions = [
    "Would adding a stop button be useful?",
    "Would adding text input be useful?",
    "Would adding conversation history be useful?",
    "Why do you use this app?",
    ]
    const [additionalThoughts, setAdditionalThoughts] = useState();
    const updateAdditionalThoughts = (e)=>{
        const {value} = e.target
        setAdditionalThoughts(value)
    }

  return <div className='h-screen w-full flex items-center justify-center'>
        <div className='rounded-xl bg-[#202123] flex flex-col items-center shadow-lg text-white h-5/6 px-12 py-6'>
            <h1 className='font-bold'>Win A Reward By Helping Us Improve</h1>
            <div className='mt-2 flex flex-col items-center justify-between grow'>
                {
                    questions.map(
                            (q, index) => (
                                 <>
                                    <p className='w-full bg-red-500'>{index+1}. {q}</p>
                                    <div className='flex justify-between w-full'>
                                        {
                                            [1,2,3,4,5].map(
                                                (v, i) => <button key={i} className='hover:bg-gray-500 border border-gray-100 flex justify-center items-center rounded-lg p-2 w-10 h-10'>{v}</button>
                                            )
                                        }
                                    </div>
                                </>
                            )
                    )
                }
                <p className='w-full text-justify'>{questions.length+1}. Any additional thoughts?</p>
                <div className='flex w-full'>
                    <textarea maxLength={100} onKeyDown={updateAdditionalThoughts} value={additionalThoughts} className='bg-gray-100 w-full rounded-lg text-black p-2 text-sm outline-none'/>
                </div>
            </div>
            <div className='flex w-full mt-6'>
                <button className='bg-green-500 rounded-lg py-2 px-6'>Submit</button>
            </div>
      

        </div>
  </div>
}

export default RegularSurvey
