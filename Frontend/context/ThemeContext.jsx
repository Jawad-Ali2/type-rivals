import { createContext, useState,useEffect, useMemo } from "react";

export const ThemeContext = createContext();
const THEME_KEY = "theme_key@type_rivals"
export const ThemeContextProvider = ({children})=>{
    const [theme, setTheme] = useState(()=>{
        const currTheme = localStorage.getItem(THEME_KEY);
        if(currTheme)
            return currTheme;
        return "light"
    })
    console.log("ACTIVE_THEME: "+theme);
    useEffect(()=>{
        localStorage.setItem(THEME_KEY, theme);
    }, [theme])
    const changeTheme = (theme)=>{
        setTheme(prev=>theme);
    }
    const value = useMemo(()=> {
        return {
         theme: theme,
         changeTheme: changeTheme 
        }
    },[theme])
    return <ThemeContext.Provider value={{theme, changeTheme}}>{children}</ThemeContext.Provider>
}