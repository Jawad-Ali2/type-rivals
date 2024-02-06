import { Loader } from "../Loader/Loader"
import broken_link from "/src/assets/broken_link.png"
export const RaceLoader = ({raceData, errors, time})=>{
   const dynamicClass = `race-loader-container  flex flex-col justify-center items-center w-full z-[100] h-screen bg-black bg-opacity-50 top[5rem] left-0 ${time<=0? "hidden":"fixed"}`
    return (
        <div className={dynamicClass}>
            {!raceData &&<>
                <Loader loading={!raceData}/>
                <p className="text-white mt-5">Fetching Paragraph...</p>
            </>}
            {raceData && <>
                <p className="text-white mt-5 text-6xl">{time}</p>
                <p className="text-white mt-5">Get Ready...</p>
            </>}
            {errors &&<>
                <p>Failed to Fetch</p>
            </>}
        </div>
    )
}