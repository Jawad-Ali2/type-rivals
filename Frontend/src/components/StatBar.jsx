const StatBar = ({date_or_rank, title, speed})=>{

    return <div className="stat-bar">
        <div className="stat-container w-[18rem] h-[3rem] bg-skin-overlayBG shadow-skin-base shadow-md pl-2 flex flex-row items-center justify-between">
            <p className="inline-block text-skin-base font-semibold float-left w-[2rem] text-center ">{date_or_rank}</p>
            <div className={"flex flex-row items-center info-container text-skin-base shadow-skin-base shadow-md float-right font-semibold w-[15rem] bg-skin-foreground h-full px-2 " + (speed? "justify-between":"justify-center")}>
                <p>{title}</p>
                {speed && <p className="w-[3rem] h-full text-center web-text-dark text-md">{speed} WPM</p>}
            </div>
        </div>
    </div>
}
export default StatBar;