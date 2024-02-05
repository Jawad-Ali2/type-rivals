import PulseLoader from "react-spinners/PulseLoader"
export const Loader = ({loading})=>{
    const color = "#1C2936"
    return <PulseLoader loading={loading} color={color}/>
}