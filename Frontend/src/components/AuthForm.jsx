import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import website_logo from "/src/assets/website_logo.png";
const AuthForm = ({ signIn }) => {
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
      <div
        className={`authform-container shadow-sm shadow-skin-base text-skin-base rounded-lg w-[90%] duration-300 transition-all mx-auto max-w-[25rem] ${
          signingIn ? "h-[30rem]" : "h-[37rem]"
        }`}
      >
        <div className="form-components w-full h-full flex flex-col justify-around items-center">
          <div className="form-header  w-full text-center h-[3rem] ">
            <p className="p-3 text-skin-base text-lg">
              Sign {signingIn ? "In" : "Up"}
            </p>
          </div>
          <div
            className={
              "form-body  w-full transition-transform duration-300 h-full"
            }
          >
            {!signingIn && <SignUp handleError={handleError} />}
            {signingIn && <SignIn handleError={handleError} />}
          </div>
          <div className="form-footer  w-full h-[3rem] flex flex-row justify-between items-center px-2">
            <button
              onClick={handleAuthSwitch}
              className=" text-skin-base text-sm w-[10rem] text-left"
            >
              {signingIn ? "Get Registered?" : "Already Registered?"}
            </button>
            <img src={website_logo} className="h-[3rem]" />
          </div>
        </div>
      </div>
    </section>
  );
};
export default AuthForm;
