import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const SignIn = ({ handleError }) => {
  document.title = "Sign In | Type Rivals"
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
    <form
      onSubmit={handleSignIn}
      method="POST"
      className="flex flex-col justify-between items-center h-full w-full pt-5"
    >
      <p className="w-full text-center text-lg web-text font-semibold">
        Welcome Back!
      </p>
      <div className="form-fields w-[90%] mx-auto h-full p-2 ">
        <input
          className="web-input w-full faded-border border-b-2"
          name="email"
          placeholder="Email"
          autoComplete="off"
        />
        <input
          className="web-input w-full faded-border border-b-2 mt-5"
          name="password"
          placeholder="Password"
          type="password"
        />
      </div>
      <button
        className="text-white p-2 web-foreground-overlay w-[5rem] rounded-lg mb-2"
        type="submit"
      >
        Log In
      </button>
    </form>
  );
};
