export const SignUp = ({handleError})=>{

    return <>
       <p className="web-text font-semibold text-lg">Sign Up</p>
        <div className="auth-fields w-[12rem] px-2 h-[8rem] ">
            <input placeholder="Username" className="web-input w-[12rem]"/>
            <input placeholder="Password" className="web-input w-[12rem] mt-5" type="password"/>
            <input placeholder="Confirm Password" className="web-input w-[12rem] mt-5" type="password"/>
        </div>
        <button className="web-button !w-[10rem]">Register</button>   
    </>
}