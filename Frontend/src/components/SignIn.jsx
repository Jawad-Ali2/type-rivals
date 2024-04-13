import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import "@/styles/forms.css";
import { backendUrl } from "../../config/config";
import { toast } from "react-toastify";
import Loader from "./Loader";

const formSchema = z.object({
  emailAddress: z.string().email(),
  password: z.string().min(3),
});

const SignIn = ({ handleError }) => {
  document.title = "Sign In | Type Rivals";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
    },
  });
  const { login, token, csrfToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit() {
    try {
      setLoading(true);
      const { emailAddress, password } = form.getValues();
      const response = await fetch(`${backendUrl}/auth/signin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Csrf-Token": csrfToken,
        },
        body: JSON.stringify({
          email: emailAddress,
          password: password,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        login(result.token, result.userId);
        toast.success("Logged in!", {
          position: "top-right",
          className: "relative top-[8rem]",
        });
        navigate("/home");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Some error occured");
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.message, {
        position: "top-right",
        className: "relative top-[8rem]",
      });
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        method="POST"
        className="flex flex-col justify-between  px-4 items-center h-full w-full pt-5"
      >
        <div className="form-fields w-full mx-auto h-full p-2 space-y-5">
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-md">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-skin-foreground border-skin-base modern-input"
                      placeholder="Enter Email Address"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
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
                  <FormLabel className="text-md">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-skin-foreground  border-skin-base modern-input"
                      placeholder="Enter your password."
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              );
            }}
          />
        </div>
        <button
          disabled={loading}
          className="text-skin-base shadow-sm shadow-skin-base bg-skin-button !w-full ui-button"
          type="submit"
        >
          {loading ? <Loader loading={loading} size={8} /> : "Submit"}
        </button>
      </form>
    </Form>
  );
};
export default SignIn;
