import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useFetch = (url) =>{
    const [fetchUrl, setFetchUrl] = useState(url)
    const [paragraph, setParagraph] = useState("")
    const [audioLink, setAudioLink] = useState(null)
    const [errors, setErrors] = useState(null) 
    const [refetch, setRefetch] = useState(false)
    const { isAuthenticated, token } = useContext(AuthContext)
    const navigate = useNavigate()
    const resetData = ()=>{
        setErrors(prev=>null)
        setParagraph(prev=>"")
        setAudioLink(prev=>null)
        setRefetch(prev=>!prev)
    }
    const fetchData = useEffect(()=>{
        if(!isAuthenticated){
            navigate("/auth")
        }
        const controller = new AbortController()
        const signal = controller.signal
        const options = {
         headers:{
             Authorization: "Bearer " + token   
         }
         ,signal
        } 
 
        const startFetching = ()=>{
            fetch(fetchUrl, options)
            .then(res=>{
                if(res.status === 200)
                    return res.json()
                else
                    return Promise.reject("Failed to fetch")
            })
            .then(data=>{
                setParagraph(prev=>data.content.text)
                setAudioLink(prev=>data.url[0])
            })
            .catch(err=>{
                if(err.name!=="AbortError")
                setErrors(prev=>err)
            })
        }
        startFetching()
        return ()=>{
            controller.abort()
        }
    },[isAuthenticated, refetch])
    return [paragraph, audioLink, errors,fetchData ,resetData]
}