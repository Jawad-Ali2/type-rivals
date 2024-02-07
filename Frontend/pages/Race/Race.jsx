import { RaceMap } from "../../components"
import { useCountDown } from "../../Hooks"
import { useEffect, useRef, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { RaceLoader } from "../../components"
import { AuthContext } from "../../context/AuthContext";
export const Race = ({duration=60})=>{
    
    document.title = "Race | Type Rivals"
    const [time,timerOn,resetTimer, setTimerOn, getFormmatedTime] = useCountDown(duration)
    const [prepareTime, prepareTimerOn,resetPrepareTimer, setPrepareTimerOn, getPrepareFormattedTime] = useCountDown(5)

    const [replay, setReplay] = useState(false)
    const [speed, setSpeed] = useState(0)
    const [errors, setErrors] = useState(null)
    const [accuracy, setAccuracy] = useState(0)
    const [mistakes, setMistakes] = useState(0)
    const [raceFinished, setRaceFinished] = useState(false)
    const [raceData, setRaceData] = useState("")

    const { isAuthenticated, token } = useContext(AuthContext)

    const maskRef = useRef()
    const originalRef = useRef()
    const statRef = useRef()

    const navigate = useNavigate()

    //Reload/Update Components
    const update = useEffect(()=>{
        setRaceFinished(prev=>false)
        setRaceData(prev=>"")
        resetTimer()
        resetPrepareTimer()
    },[replay])
    //Prepare Timer
    useEffect(()=>{
        if(raceData){
        setPrepareTimerOn(true)
        }
    },[raceData])
    //Race Timer
    useEffect(()=>{
        if(prepareTime<=0){
            setTimerOn(true);
        }
    }, [prepareTime])

    //Paragraph Fetch useEffect
    useEffect(()=>{
       if(!isAuthenticated){
        navigate("/auth")
       }
       const controller = new AbortController()
       const signal = controller.signal
       const options = {
        headers:{
            Authorization: "Bearer " + token   
        }
        ,signal
       } 
       
       //Fetching Paragraph
       const getParagraph = ()=>{
        fetch("http://localhost:8000/user/quick-race", options)
        .then(res=>{
            if(res.status===200){
                return res.json()
            }else{
                return new Promise.reject("Failed to Fetch.")
            }
        }).then(data=>{
            setRaceData(prev=>data.content.text)
        }).catch(err=> {
            if(err.name !=="AbortError"){
                setErrors(prev=>err)
            }
        })
       }
       getParagraph()
       return ()=>{
        controller.abort()
       }
    },[isAuthenticated, replay])
    //Speed Measuring
    const handleSpeedMeasuring = (inpText, originalText) =>{
        let total_valid_words = 0
        let total_invalid_words = 0
        total_valid_words = inpText.length/5
        const time_taken = (duration - time)
        const time_in_minutes = time_taken/60
        const wpm =(total_valid_words - total_invalid_words)/time_in_minutes
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
        <RaceLoader raceData={raceData} errors = {errors}  time={prepareTime}/> 
        <div className="race-container pt-[5rem] w-[90%] mx-auto">
            <div className="racemap-container w-full">
                <p className="web-text font-semibold">Race Map</p>
                <p className="web-text font-semibold float-right">{getFormmatedTime(time)} </p>
                <RaceMap maskRef = {maskRef} originalRef = {originalRef} setRaceFinished = {setRaceFinished} setMistakes= {setMistakes} raceData = {raceData} raceTimerOn = {timerOn}/>   
            </div>
           {raceData && <div ref={statRef} className="lock-screen absolute w-full h-full top-[5rem] z-[-10] flex left-0 flex-row items-center justify-center transition-all duration-300">
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