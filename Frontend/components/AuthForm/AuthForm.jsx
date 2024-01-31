import {useState} from "react"
import { SignIn } from "../SignIn/SignIn"
import { SignUp } from "../SignUp/SignUp"
export const AuthForm = ({signIn})=>{
    const [signingIn, setSigningIn] = useState(signIn)
    const [errors, setErrors] = useState(null)
    const handleError = ()=>{
    }
    const handleAuthSwitch = ()=>{
        if(signingIn){
            setSigningIn(prev=>false)
        }else{
            setSigningIn(prev=>true)
        }
    }
    return <section className="authform-section">
        <form className="authform web-foreground w-full mx-auto max-w-[20rem] h-[20rem] rounded-lg flex items-center border-4 web-border flex-col justify-between py-2">
           {signingIn && <SignIn handleError={handleError}/>}
           {!signingIn && <SignUp handleError={handleError}/>}
        </form>
        <div className="formnav-buttons w-full text-center web-text">
           {!signingIn && <button onClick={handleAuthSwitch}>Log In</button>}
            {signingIn&& <button onClick={handleAuthSwitch}>Sign Up</button>}
        </div>
    </section>
}