import React from 'react'

function AslModal() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <div className='w-4/5 h-4/5 bg-[#202123] rounded-lg p-4 flex flex-col items-center justify-between'>
            <div id='asl-video-container' className='grow max-h-[250px] w-full bg-red-500 mb-5 rounded-lg'>
                ss
            </div>
            <div className='text-white grow mb-2 asl-response-container border-gray-700 border rounded-lg max-h-[120px] hide__scroll__bar w-full text-justify p-4 flex flex-col overflow-y-scroll text-wrap'>
                {
                Array(95).fill(0).map(()=><div className='flex mb-2'>
                    <div className='rounded-full w-[32px] h-[32px] bg-red-500 flex justify-center items-center mx-2'>pp</div>
                    <p className='w-full text-justify italic font-thin'> {
                        Array(95).fill(0).map(()=> <>Lorem Ipsum</>)
                    }</p>
                </div>)
                }
            </div>
            <div className="border-gray-700 border rounded-lg max-h-[120px] hide__scroll__bar w-full text-justify p-4 flex justify-center overflow-y-scroll text-wrap">
                <p id='translated-asl-text' className='text-white font-thin italic'>
                    {
                        Array(95).fill(0).map(()=> <>Lorem Ipsum</>)
                    }
                </p>
            </div>
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
