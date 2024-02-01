import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export const SignUp = ({ handleError }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  async function handleSignup(e) {
    e.preventDefault();

    const formData = new FormData();

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target["confirm-password"].value;
    const age = e.target.age.value;

    formData.append("name", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("age", age);

    console.log(formData);

    const response = await fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        age: age,
      }),
    });
    if (response.ok) {
      navigate("/home");
    }
  }

  return (
    <div className="authform web-foreground w-full mx-auto max-w-[20rem] h-[25rem] rounded-lg flex items-center border-4 web-border flex-col justify-between py-2">
      <p className="web-text font-semibold text-lg">Sign Up</p>
      <div className="auth-fields w-[12rem] px-2">
        <form onSubmit={handleSignup} method="POST">
          <input
            placeholder="typer69"
            name="username"
            type="text"
            className="web-input w-[12rem] p-2"
          />
          <input
            placeholder="typer@email.com"
            name="email"
            type="text"
            className="web-input w-[12rem] mt-5"
          />
          <input
            placeholder="*****"
            type="password"
            className="web-input w-[12rem] mt-5"
            name="password"
          />
          <input
            placeholder="Confirm Password"
            className="web-input w-[12rem] mt-5"
            name="confirm-password"
            type="password"
          />
          <input
            type="number"
            className="web-input w-[12rem] mt-5"
            name="age"
            id="age"
          />
          <button type="submit" className="web-button !w-[10rem] mt-10">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};
