import "./RaceMap.css"
import { useState, useEffect } from "react"

export const RaceMap = ({maskRef, originalRef, setRaceFinished, setMistakes})=>{
    const success = "text-green-600"
    const error = "text-red-500"
    const [input, setInput] = useState("")
    const [mask, setMask] = useState("")
    const [color, setColor] = useState(success)
    const race_paragaraph ="Anime, a captivating form of animated entertainment originating from Japan, has grown into a global phenomenon. Its influence extends far beyond its home country, captivating audiences worldwide with its diverse genres and compelling storytelling."
    
    const handleChange = useEffect(()=>{
        if(input===race_paragaraph){
            setRaceFinished(prev=>true)
        }
        const progressed_race = race_paragaraph.slice(0, input.length)
        if(input === progressed_race){
        
            setMask(prev=>input)
            setColor(success)
        } else{
            setMistakes(prev=>prev+1)
            setColor(error)
        }
    }, [input])
    return <section className="racemap-section relative">
        
        <div ref={originalRef} className="racemap w-full h-fit rounded web-foreground text-left web-text p-2 overflow-hidden">
            {race_paragaraph}
        </div>
        <div ref={maskRef} className={"racemask absolute top-[1.5rem] w-full h-fit rounded  text-left  p-2 overflow-hidden " + color}>
            {mask}
        </div>
        <div className="input-area w-full mt-5">
            <input onChange={e=>{setInput(e.target.value)}} value={input} className="w-full web-text web-body outline-none px-2 h-[2rem] border-b-2 border-[#1C2936]" placeholder="Type Here..." ></input>
        </div>
    </section>
}