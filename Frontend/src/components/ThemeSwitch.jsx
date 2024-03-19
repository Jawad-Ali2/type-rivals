import { ThemeContext } from "../../context/ThemeContext"
import { useContext, useState } from "react";
const ThemeSwitch = ()=>{
    const {theme, changeTheme} = useContext(ThemeContext)

    const handleOnFocusEnter = ()=>{
        const dropup = document.querySelector('.options-container');
        dropup.classList.add('h-[10rem]');
        dropup.classList.add('opacity-100');
        dropup.classList.remove('opacity-0');
        dropup.classList.remove('h-[0rem]');
    }
    const handleOnFocusExit = ()=>{
        const dropup = document.querySelector('.options-container');
        dropup.classList.remove('h-[10rem]');
        dropup.classList.add('h-[0rem]');
        dropup.classList.add('opacity-0');
        dropup.classList.remove('opacity-100');
    }
    const getAndSetTheme = e =>{
        if(e.target.checked){
            changeTheme(e.target.value)
        }
    }
    const theme_names = ["light", "dark","slate"]
    return (
    <div onMouseEnter={handleOnFocusEnter} onMouseLeave={handleOnFocusExit} className="theme-switch-container fixed z-[1000] w-[10rem] right-[2rem] bottom-[1rem]">
        <div className="options-container transition-all opacity-0 duration-300 w-[10rem]  fixed z-[1000] right-[2rem] bottom-[5rem] rounded-lg text-skin-base shadow-md shadow-skin-base bg-skin-overlayBG">
                {theme_names.map((el,i)=>(
                    <div className="theme-btn mx-auto w-full p-2 m-2 rounded-sm hover:bg-skin-bar " key={i}>
                        <label className="cursor-pointer w-full">
                        <input id={el+"-theme"} value={el} defaultChecked={theme===el} onChange={e=>getAndSetTheme(e)} name="theme-opt" className="cursor-pointer scale-[105%]" type="radio"/>
                            <p id="theme-name" className="ml-2 inline-block capitalize">{el}</p>
                        </label>
                    </div>
                ))}
        </div>
        <button className="theme-switch text-skin-base shadow-sm  !w-full shadow-skin-base bg-skin-button  ui-button capitalize">Theme</button>
    </div>)
}
export default ThemeSwitch;