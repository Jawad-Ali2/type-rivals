import PulseLoader from "react-spinners/PulseLoader"
import { useContext } from "react"
import { ThemeContext } from "../../context/ThemeContext"
export const Loader = ({loading})=>{
    const {theme} = useContext(ThemeContext)
    const color = theme==="light"? "dodgerblue":"white";
    return <PulseLoader loading={loading}  color={color}/>
}