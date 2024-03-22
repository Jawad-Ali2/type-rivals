import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import default_dp from "/src/assets/Default_dp.png";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "@/styles/forms.css";
import { backendUrl } from "../../config/config";

const formSchema = z
  .object({
    username: z
      .string()
      .min(4, { message: "Username must be at least 4 characters." }),
    emailAddress: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters." })
      .refine(
        (value) =>
          /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value),
        { message: "Password is too weak." }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const SignUp = ({ handleError }) => {
  document.title = "Sign Up | Type Rivals";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      emailAddress: "",
      password: "",
      confirmPassword: "",
    },
  });
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

  async function handleSignup() {
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

    const response = await axios.post(`${backendUrl}/auth/signup`, formData, {
      withCredentials: true,
      headers: {
        "x-csrf-token": csrfToken,
      },
    });
    console.log(response.status);
    if (response.status === 201) {
      navigate("/home");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSignup)}
        method="POST"
        className="flex flex-col justify-between items-center h-full px-4"
      >
        <div className="form-fields w-full mx-auto space-y-2 flex flex-col  justify-between items-stretch pt-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-md">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter username"
                      className="bg-skin-foreground border-skin-base modern-input"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-md">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email address "
                      className="bg-skin-foreground border-skin-base modern-input"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-md ">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter password"
                      className="bg-skin-foreground border-skin-base modern-input"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-md">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      className="bg-skin-foreground border-skin-base modern-input"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              );
            }}
          />
        </div>
        <button
          className="text-skin-base shadow-sm shadow-skin-base bg-skin-button mt-2 !w-full ui-button"
          type="submit"
        >
          Submit
        </button>
      </form>
    </Form>
  );
};
export default SignUp;
