import PulseLoader from "react-spinners/PulseLoader"
import { useContext } from "react"
import { ThemeContext } from "../../context/ThemeContext"
const Loader = ({loading})=>{
    const {theme} = useContext(ThemeContext)
    const getColor = ()=>{
        if(theme==="light")
            return "#000";
        else if(theme==="dark")
            return "#0d2844";
        return "white";
    }
    return <PulseLoader loading={loading}  color={getColor()}/>
}
export default Loader;