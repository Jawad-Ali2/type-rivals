
export const AudioMap = ({audioLink})=>{
    return <div className="audio-map-container">
    <audio controls>
        <source src={audioLink} type="audio/mp3"/>
    </audio>
    </div>
}