import { useRef, useState, useEffect } from "react"
import styled, {keyframes} from 'styled-components'
import "./AudioMap.css"
import narrator_icon from "/src/assets/speaker.png"

const VOLUME_KEY="volume@typerivals"
export const AudioMap = ({audioLink})=>{
    const audioRef = useRef()
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [volume, setVolume] = useState(()=>{
        const vol = localStorage.getItem(VOLUME_KEY)
        if(vol)
            return vol
        return 50
    })
    const ToggleAudio = ()=>{
        if(!isPlaying){
            audioRef.current.play()
        } else{
            audioRef.current.pause()
        }
        setIsPlaying(prev=>!prev)
    }
    const handleVolumeChange = useEffect(()=>{
        audioRef.current.volume = volume/100
        localStorage.setItem(VOLUME_KEY, volume)
    }, [volume])
    const fadeInOut = keyframes`
    0%{
        opacity:1
    }
    50%{
        opacity:0.2
    }
    100%{
        opacity:1
    }
    `;
    const FadingDiv = styled.div`animation:${isPlaying?fadeInOut:null} 1.5s linear infinite`;
    const handleDurationChange = ()=>{
        if(audioRef){
            const progressedTrackDuration = (audioRef.current.currentTime/audioRef.current.duration) * 100
            setCurrentTime(prev=>progressedTrackDuration)
        
            if(progressedTrackDuration === 100){
                setIsPlaying(prev=>false)
            }
        } 
    }
    useEffect(()=>{
        if(audioRef){
        audioRef.current.addEventListener('timeupdate', handleDurationChange)
        }
        return ()=>{
            if(audioRef)
            audioRef.current.removeEventListener('timeupdate', handleDurationChange)
        }
    },[])
    const getFormmatedTime = (time)=>{
        let minutes = Math.floor(time / 60);
        let seconds = Math.round(time % 60);
        let formatted_time = `${minutes < 10? "0" :""}${minutes}:${seconds<10? "0":""}${seconds}`   
        return formatted_time
    }
    return <div className="audio-map-container w-full">
        <div className="audio-box w-[90%] mx-auto max-w-[45rem] h-[10rem] rounded-xl web-foreground">
            <audio ref={audioRef} src={audioLink}  type="audio/mp3">
            
            </audio>
            <div className="visual-audio flex flex-col rounded-l p-3 bg-blue-950 items-center justify-between h-full w-[50%] min-w-[20rem] float-left">
                <FadingDiv className="icon-flash">
                    <img src={narrator_icon} className="narrator-icon w-[100px] h-[100px]" />    
                </FadingDiv>
                <div className="duration-area relative">
                    <p className="web-icon text-sm absolute left-[-2.6rem] top-[6px]">{audioRef?.current? getFormmatedTime(audioRef.current.currentTime):0}</p>
                    <p className="web-icon text-sm absolute right-[-2.6rem] top-[6px]">{audioRef?.current? getFormmatedTime(audioRef.current.duration): 0}</p>     
                    <input id="duration-control" className="w-[10rem]" type="range" min={0} max={100} value={currentTime} readOnly/>
                </div>
            </div>
            <div className="playback-controls flex flex-col items-center justify-between p-3 h-full w-[50%] float-right">
                <button onClick={ToggleAudio} id="playback-control" className={"fa-solid mt-[3rem] fa-2xl audio-btn " + (isPlaying? "fa-pause":"fa-play")}></button>
                <div className="volume-area relative" >
                    <i className="absolute web-icon fa-solid fa-volume-high left-[-2rem] top-[8px]"></i>
                    <input id="volume-control" className="w-[10rem]" type="range" min={0} max={100} value={volume} onChange={e=>setVolume(e.target.value)}/>
                </div>
            </div>
        </div>
    </div>
}