import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import default_dp from "/src/assets/Default_dp.png";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export const SignUp = ({ handleError }) => {
  document.title = "Sign Up | Type Rivals";
  const [preview, setPreview] = useState(default_dp);
  const { csrfToken } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(csrfToken);

  const handleImageChange = (e) => {
    const prev_img = e.target.files[0];
    if (prev_img) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(prev_img);
    } else {
      setPreview(default_dp);
    }
  };

  async function handleSignup(e) {
    e.preventDefault();

    const formData = new FormData();

    const profilePic = e.target["profile-picture"].files[0];
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target["confirm-password"].value;

    formData.append("profilePicture", profilePic);
    formData.append("name", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    const response = await axios.post(
      "http://localhost:8000/auth/signup",
      formData,
      {
        withCredentials: true,
        headers: {
          "x-csrf-token": csrfToken,
        },
      }
    );
    console.log(response.status);
    if (response.status === 201) {
      navigate("/home");
    }
  }

  return (
    <form
      onSubmit={handleSignup}
      method="POST"
      className="flex flex-col justify-between items-center h-full"
    >
      <div className="form-fields w-[90%] mx-auto">
        <div className="dp-input  w-full h-[5rem] flex flex-row justify-between items-center text-white my-2">
          <label
            className="bg-skin-overlayBG cursor-pointer p-2"
            htmlFor="profile-picture"
          >
            Select Profile Picture
            <input
              onChange={(e) => {
                handleImageChange(e);
                // setFile(e.target.files[0]);
              }}
              id="profile-picture"
              type="file"
              className="hidden"
              accept="image/"
            />
          </label>
          <div className="web-foreground-overlay profile-preview h-[5rem] w-[5rem]">
            <img src={preview} className="w-full h-full" />
          </div>
        </div>
        <input
          className="web-input bg-skin-foreground w-full faded-border border-b-2"
          autoComplete="off"
          placeholder="Alias"
          id="username"
        />
        <input
          className="web-input bg-skin-foreground w-full faded-border border-b-2"
          autoComplete="off"
          placeholder="Email"
          id="email"
        />
        <input
          className="web-input bg-skin-foreground w-full faded-border border-b-2"
          type="password"
          placeholder="Password"
          id="password"
        />
        <input
          className="web-input bg-skin-foreground w-full faded-border border-b-2"
          type="password"
          placeholder="Confirm Password"
          id="confirm-password"
        />
      </div>
      <button
        className="text-skin-base shadow-md shadow-skin-base bg-skin-button  ui-button "
        type="submit"
      >
        Register
      </button>
    </form>
  );
};
