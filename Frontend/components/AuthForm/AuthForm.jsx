import { useState } from "react";
import { SignIn } from "../SignIn/SignIn";
import { SignUp } from "../SignUp/SignUp";
import website_logo from "/src/assets/website_logo.png"
export const AuthForm = ({ signIn }) => {
  const [signingIn, setSigningIn] = useState(signIn);
  const [errors, setErrors] = useState(null);
  const handleError = () => {};
  const handleAuthSwitch = () => {
    if (signingIn) {
      setSigningIn((prev) => false);
    } else {
      setSigningIn((prev) => true);
    }
  };
  return (
    <section className="authform-section">
      <div className="authform-container w-[90%] mx-auto max-w-[25rem] h-[28rem]">
        <div className="form-components w-full h-full flex flex-col justify-around items-center">
            <div className="form-header web-gradient w-full text-center h-[3rem] ">
              <p className="p-3 text-white text-lg">Sign {signingIn? "In": "Up"}</p>
            </div>
            <div className="form-body web-foreground w-full h-[20rem]">
              {!signingIn &&<SignUp handleError={handleError}/>}
              {signingIn && <SignIn handleError={handleError}/>}
            </div>
            <div className="form-footer web-gradient w-full h-[3rem] flex flex-row justify-between items-center px-2">
                <button onClick={handleAuthSwitch} className=" text-white text-sm w-[10rem] text-left">
                    {signingIn? "Get Registered?":"Already Registered?"} 
                </button>
                <img src={website_logo} className="h-[3rem]"/>
            </div>
        </div>
      </div>
    </section>
  );
};
