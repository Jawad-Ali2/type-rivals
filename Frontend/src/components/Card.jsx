import { useNavigate } from "react-router-dom"
const Card = ({title,body,link, button_text})=>{
    const navigate = useNavigate()
    
    const handleClick = (e)=>{
        e.preventDefault();
        navigate(link)
    }
    return <div className="card-container shadow-md shadow-skin-base rounded-lg">
        <div className="mcard bg-skin-foreground w-[18rem] rounded-lg  h-[20rem] flex flex-col justify-between items-center py-2">
            <p className="web-text font-semibold text-md">{title}</p>
            <div className="text-area w-full text-center text-sm web-text">
                {body}
            </div>
            <div className="button-container">
                <button onClick={handleClick} className="bg-skin-button shadow-md shadow-skin-base text-skin-base rounded-xl hover:scale-105 transition-all duration-300 p-2">
                    {button_text}
                </button>
            </div>
        </div>
    </div>
}
export default Card;