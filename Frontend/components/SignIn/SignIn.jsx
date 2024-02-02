import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const SignIn = ({ handleError }) => {
  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSignIn(e) {
    e.preventDefault();

    console.log(e.target.email.value);

    const response = await fetch("http://localhost:8000/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });
    if (response.ok) {
      const result = await response.json();
      login(result.token);
      navigate("/home");
    }
  }
  return (
    <div className="authform web-foreground w-full mx-auto max-w-[20rem] h-[20rem] rounded-lg flex items-center border-4 web-border flex-col justify-between py-2">
      <p className="web-text font-semibold text-lg">Sign In</p>
      <div className="auth-fields w-[12rem] px-2 ">
        <form onSubmit={handleSignIn} method="post">
          <input
            placeholder="email@email.com"
            name="email"
            type="email"
            className="web-input w-[12rem]"
          />
          <input
            placeholder="Password"
            name="password"
            className="web-input w-[12rem] mt-5"
            type="password"
          />
          <button type="submit" className="web-button !w-[10rem]">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
