import { Loader } from "../Loader/Loader"
import broken_link from "/src/assets/broken_link.png"
export const RaceLoader = ({errors, raceStarted, time})=>{
   const dynamicClass = `race-loader-container  flex flex-col justify-center items-center w-full z-[100] h-screen bg-black bg-opacity-50 top-0 left-0 ${time<=0? "hidden":"absolute"}`
    return (
        <div className={dynamicClass}>
            {!errors && <Loader loading={raceStarted}/>}
            {raceStarted && !errors && <p className="text-white mt-5">Fetching Paragaraph...</p>}
            {!raceStarted && !errors &&<p className="text-white text-6xl">{time}</p>}
            {!raceStarted && !errors &&<p className="text-white mt-5">Get Ready...</p>}
            {errors && <img src={broken_link} className="h-[5rem]"/>}   
            {errors && <p className="text-white mt-5">Failed To Fetch</p>}
        </div>
    )
}