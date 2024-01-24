// Define our labelmap
const labelMap = {
    1:{name:'Hello', color:'red'},
    2:{name:'Thank You', color:'yellow'},
    3:{name:'I Love You', color:'lime'},
    4:{name:'Yes', color:'blue'},
    5:{name:'No', color:'purple'},
}

// Define a drawing function
export const writeTranslation = (boxes, classes, scores, threshold, aslToTextRef)=>{
    for(let i=0; i<=boxes.length; i++){
        if(boxes[i] && classes[i] && scores[i]>threshold){
            // Extract variables
            // const [y,x,height,width] = boxes[i]
            const text = classes[i]
            return labelMap[text]['name'];
        }
    }
}

export const submitText = (data) => fetch('https://hiss7jkohg254p62dmmjilppia0gzbrb.lambda-url.eu-west-2.on.aws/',{
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Acccept': '*/*'
      },
      body: JSON.stringify(data),
  }).catch((error) => {console.error(error)});

export const getMessagesFromLocalStorage = () => JSON.parse(localStorage.getItem("voiceGPTLocalStorage")) ?? [];

export function saveToLocalStorage(msgs){
    localStorage.setItem("voiceGPTLocalStorage", JSON.stringify([]))
    localStorage.setItem("voiceGPTLocalStorage", JSON.stringify([...msgs]))
}
