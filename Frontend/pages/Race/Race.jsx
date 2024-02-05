import { RaceMap } from "../../components"
import { useCountDown } from "../../Hooks"
import { useEffect, useRef, useState } from "react"
export const Race = ({duration=60})=>{

    document.title = "Race | Type Rivals"
    const [time,timerOn, setTimerOn, getFormmatedTime] = useCountDown(duration)
    const [speed, setSpeed] = useState(0)
    const [accuracy, setAccuracy] = useState(0)
    const [mistakes, setMistakes] = useState(0)
    const [raceFinished, setRaceFinished] = useState(false)
    const maskRef = useRef()
    const originalRef = useRef()
    const statRef = useRef()
    useEffect(()=>{
        console.log("Timer Enabled")
        setTimerOn(true)
    },[])
    const handleSpeedMeasuring = (inpText, originalText) =>{
        let total_valid_words = 0
        let words = inpText.split(" ")
        let original_words = originalText.split(" ")
        let total_invalid_words = 0
        console.log(words)
        total_valid_words = inpText.length/5
        let time_taken = (duration - time)/duration
        const wpm =(total_valid_words - total_invalid_words)/time_taken
        let acc= (inpText.length - mistakes)/ inpText.length * 100
        setSpeed(prev=>Math.round(wpm))
        setAccuracy(prev=>Math.round(acc))
    }
    const handleTimeout = ()=>{
        statRef.current.classList.add("web-transparent")
        statRef.current.classList.toggle("z-[-10]")
        const statdiv = document.getElementsByClassName("finish-statistics")[0]
        statdiv.classList.remove("top-[-25rem]")
        statdiv.classList.add("top-[5rem]")
        handleSpeedMeasuring(maskRef.current.innerText, originalRef.current.innerText)
    }
    useEffect(()=>{
        if(time<=0 && !raceFinished){
            handleTimeout()
        }
        if(raceFinished && timerOn){
            console.log("TimerDisabled")
            setTimerOn(false)
            handleTimeout()
        }
    }, [time,raceFinished])
    return <section className="race-section w-full max-w-[45rem]"> 
        <div className="race-container pt-[5rem] w-[90%] mx-auto">
            <div className="racemap-container w-full">
                <p className="web-text font-semibold">Race Map</p>
                <p className="web-text font-semibold float-right">{getFormmatedTime(time)} </p>
                <RaceMap maskRef = {maskRef} originalRef = {originalRef} setRaceFinished = {setRaceFinished} setMistakes= {setMistakes}/>   
            </div>
            <div ref={statRef} className="lock-screen absolute w-full h-full top-[5rem] z-[-10] flex left-0 flex-row items-center justify-center transition-all duration-300">
                <div className="finish-statistics absolute  z-10 top-[-25rem] w-[20rem] transition-all duration-300 h-[20rem] web-foreground rounded-lg">
                    <p className="web-text font-semibold w-full text-center p-2">Statistics</p>
                    <table className="w-full max-w-[15rem] mx-auto px-2 web-text font-semibold text-sm text-center">
                        <thead>
                        <tr>
                            <th className="px-2">
                            </th>
                            <th>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Speed</td>
                            <td>{speed} WPM</td>
                        </tr>
                        <tr>
                            <td>Time Taken</td>
                            <td>{getFormmatedTime(duration-time)}</td>
                        </tr>
                        <tr>
                            <td>Accuracy</td>
                            <td>{accuracy}%</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
}