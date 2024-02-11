import { AudioMap } from "../../components"
import { useFetch, useCountDown } from "../../Hooks"
import { RaceLoader } from "../../components"
import { useEffect } from "react"
export const Narrator = ()=>{
    const [prepareTime, prepareTimerOn, resetPrepareTimer, setPrepareTimerOn, getPrepareFormattedTime] = useCountDown(5)
    const [paragraph, audioLink, errors, resetData] = useFetch("http://localhost:8000/user/quick-race/")

    useEffect(()=>{
        if(audioLink){
            setPrepareTimerOn(prev=>true)
        }
    },[audioLink])
    const getTrackDuration = ()=>{
        if(audioLink){
            const audio = new Audio(audioLink);
            return audio.duration;
        }
        return 60;
    }
    return <section className="narrator-section w-full max-w-[45rem]">
        <RaceLoader loading={!audioLink} time={prepareTime} errors={errors}>Fetching Audio...</RaceLoader>
        <div className="narrator-container w-full pt-[5rem]">
            {audioLink && <AudioMap audioLink = {audioLink} startRace = {prepareTimerOn} trackDuration = {getTrackDuration()}/>}
        </div>
    </section>
}