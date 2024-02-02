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
    <form onSubmit={handleSignIn} method="POST" className="flex flex-col justify-between items-center h-full w-full">
    <div className="form-fields w-[90%] mx-auto ">
      <input className="web-input w-full faded-border border-b-2" placeholder="Email"/>
      <input className="web-input w-full faded-border border-b-2 mt-5" placeholder="Password"/>
    </div>
    <button className="text-white p-2 web-foreground-overlay w-[5rem] rounded-lg mb-2" type="submit">Log In</button>
  </form>
  );
};
