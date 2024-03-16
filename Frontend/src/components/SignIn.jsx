import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignIn = ({ handleError }) => {
  document.title = "Sign In | Type Rivals"; 
  const { login, token, csrfToken } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSignIn(e) {
    e.preventDefault();

    console.log(e.target.email.value, token, csrfToken);

    const response = await fetch("http://localhost:8000/auth/signin", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + token,
        "X-Csrf-Token": csrfToken,
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });
    if (response.ok) {
      const result = await response.json();
      login(result.token, result.userId);
      navigate("/home");
    }
  }
  return (
    <form
      onSubmit={handleSignIn}
      method="POST"
      className="flex flex-col justify-between items-center h-full w-full pt-5"
    >

      <div className="form-fields w-[90%] mx-auto h-full p-2 ">
        <input
          className="web-input text-skin-base bg-skin-foreground w-full faded-border border-b-2"
          name="email"
          placeholder="Email"
          autoComplete="off"
        />
        <input
          className="web-input text-skin-base bg-skin-foreground w-full faded-border border-b-2 mt-5"
          name="password"
          placeholder="Password"
          type="password"
        />
      </div>
      <button
        className="text-skin-base shadow-md shadow-skin-base bg-skin-button  ui-button"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};
export default SignIn;