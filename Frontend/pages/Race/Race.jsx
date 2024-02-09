import { RaceMap } from "../../components"
import { useCountDown, useFetch } from "../../Hooks"
import { useEffect, useRef, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { RaceLoader } from "../../components"

export const Race = ({duration=60})=>{    
    document.title = "Race | Type Rivals"
    const [time,timerOn,resetTimer, setTimerOn, getFormmatedTime] = useCountDown(duration-55)
    const [prepareTime, prepareTimerOn,resetPrepareTimer, setPrepareTimerOn, getPrepareFormattedTime] = useCountDown(5)

    const [replay, setReplay] = useState(false)
    const [speed, setSpeed] = useState(0)
    const [accuracy, setAccuracy] = useState(0)
    const [mistakes, setMistakes] = useState(0)
    const [raceFinished, setRaceFinished] = useState(false)
   
    const maskRef = useRef()
    const originalRef = useRef()
    const statRef = useRef()

    const navigate = useNavigate()
    
    
    const [paragraph, audioLink, errors,resetData] = useFetch("http://localhost:8000/user/quick-race/") 
    //Reload/Update Components
    const update = useEffect(()=>{
        setRaceFinished(prev=>false)
        resetData()
        resetTimer()
        resetPrepareTimer()
    },[replay])
    //Prepare Timer
    useEffect(()=>{
        if(paragraph){
        setPrepareTimerOn(true)
        }
    },[paragraph])
    //Race Timer
    useEffect(()=>{
        if(prepareTime<=0){
            setTimerOn(true);
        }
    }, [prepareTime])

    //Speed Measuring
    const handleSpeedMeasuring = (inpText) =>{
        const total_valid_words = inpText.length/5
        const time_taken = (duration - time)
        const time_in_minutes = time_taken/60
        const wpm =total_valid_words/time_in_minutes
        let acc= (inpText.length - mistakes)/ inpText.length * 100
        acc = acc? acc:0
        setSpeed(prev=>Math.round(wpm))
        setAccuracy(prev=>Math.round(acc))
    }
    const handleTimeout = ()=>{
        statRef.current.classList.add("web-transparent")
        statRef.current.classList.toggle("z-[-10]")
        const statdiv = document.getElementsByClassName("finish-statistics")[0]
        statdiv.classList.remove("top-[-25rem]")
        statdiv.classList.add("top-[5rem]")
        handleSpeedMeasuring(maskRef.current.innerText)
    }
    useEffect(()=>{
        let session_ended = false
        if(time<=0 && !raceFinished){
            handleTimeout()
            session_ended=true
        }
        if(raceFinished && timerOn){
            setTimerOn(false)
            handleTimeout()
            session_ended=true
        }
        if(session_ended && speed){
            console.log(speed)
            //Save Info Here Bro...
        }
    }, [time,raceFinished,speed])
    return <section className="race-section w-full max-w-[45rem]">
        <RaceLoader loading={!paragraph} errors = {errors}  time={prepareTime}>Fetching Paragraph...</RaceLoader> 
        <div className="race-container pt-[5rem] w-[90%] mx-auto">
            <div className="racemap-container w-full">
                <p className="web-text font-semibold">Race Map</p>
                <p className="web-text font-semibold float-right">{getFormmatedTime(time)} </p>
                <RaceMap maskRef = {maskRef} originalRef = {originalRef} setRaceFinished = {setRaceFinished} setMistakes= {setMistakes} raceData = {paragraph} raceTimerOn = {timerOn}/>   
            </div>
           {paragraph && <div ref={statRef} className="lock-screen absolute w-full h-full top-[5rem] z-[10] flex left-0 flex-row items-center justify-center transition-all duration-300">
                <div className="finish-statistics absolute  z-10 top-[-25rem] w-[20rem] transition-all duration-300 h-[20rem] web-foreground rounded-lg">
                    <p className="web-text font-semibold w-full text-center p-2">Statistics</p>
                    <div className="stat-body w-full h-[17rem] p-2 flex flex-col items-center justify-between">
                        <table className="w-full max-w-[15rem]  mx-auto px-2 web-text font-semibold text-md text-left">
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
                        <button className="web-button" onClick={()=>{setReplay(prev=>!prev)}}>Replay</button>
                    </div>
                </div>
            </div>}
        </div>
    </section>
}