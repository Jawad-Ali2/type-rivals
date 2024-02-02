import { useNavigate } from "react-router-dom";
import { useState } from "react";
import default_dp from "/src/assets/Default_dp.png"
export const SignUp = ({ handleError }) => {
  const [preview, setPreview] = useState(default_dp)
  const handleImageChange = (e)=>{
    const prev_img = e.target.files[0]  
    if(prev_img){
      const reader = new FileReader()
      reader.onloadend = ()=>{
        setPreview(reader.result)
      }
      reader.readAsDataURL(prev_img)
    } else{
      setPreview(default_dp)
    }
  }
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
  <form onSubmit={handleSignup} method="POST" className="flex flex-col justify-between items-center h-full">
    <div className="form-fields w-[90%] mx-auto">
      <div className="dp-input  w-full h-[5rem] flex flex-row justify-between items-center text-white my-2">
        <label className="web-foreground-overlay p-2" for="profile-picture">Select Profile Picture<input onChange={handleImageChange} id="profile-picture" type="file" className="hidden" accept="image/"/></label>
        <div className="web-foreground-overlay profile-preview h-[5rem] w-[5rem]"><img src={preview} className="w-full h-full"/></div>
      </div>
      <input className="web-input w-full faded-border border-b-2" placeholder="Alias"/>
      <input className="web-input w-full faded-border border-b-2" placeholder="Email"/>
      <input className="web-input w-full faded-border border-b-2" placeholder="Password"/>
      <input className="web-input w-full faded-border border-b-2" placeholder="Confirm Password"/>
    </div>
    <button className="text-white p-2 web-foreground-overlay w-[5rem] rounded-lg mb-2" type="submit">Register</button>
  </form>)
};
