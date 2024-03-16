import { useState, useEffect } from "react"
const TrackInput = ({paragraph,input,setInput, setCorrect, raceFinished, setRaceFinished})=>{
    
    const handleInputChange = (e)=>{
        const typedInput = e.target.value;
        const progressedParagraph = paragraph.slice(0, typedInput.length)
        setInput(prev=>typedInput)
        if(typedInput===progressedParagraph){
            setCorrect(prev=>true)
            if(typedInput===paragraph){
                setRaceFinished(prev=>true)
                console.log("YES: " + raceFinished)
            }
        } else{
            setCorrect(prev=>false)
        }
    }
    return <input disabled={raceFinished} value={input} onChange={handleInputChange} placeholder="Type Here..." className="track-input pr-6 web-body border-b-2 border-skin-base outline-none web-text w-full"/>

}
export default TrackInput;