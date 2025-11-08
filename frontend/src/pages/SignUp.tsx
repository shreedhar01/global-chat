import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"


export default function SignUp() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  // const [error, setError] = useState()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
        username, email, password
      })

      toast.success("Account created successfully!");
      navigate("/sign-in");

    } catch (err:any) {
      console.error("Error:", err);
      const msg =
        err.response?.data?.message || "Something went wrong. Try again.";

      // setError(err.response?.data || msg);
      toast.error(msg);
    }
  }
  return (
    <div className="first">
      <div className="flex flex-col w-full md:w-7xl  justify-center items-center gap-y-4 h-[90vh]">
        <h1 className="text-xl">Create a account</h1>
        <form onSubmit={handleSubmit} className="border w-65/100 md:w-25/100 p-4 rounded-xl">
          <FieldGroup>
            <FieldSet>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ram Thapa"
                  onChange={e => setUsername(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="ram@gmail.com"
                  onChange={e => setEmail(e.target.value)}
                />
                {/* {error && <FieldError>Choose another email.</FieldError>} */}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={e => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                <Input
                  id="confirm-password"
                  type="confirm-password"
                  placeholder="••••••••"
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                {password.trim() !== confirmPassword.trim() ? <FieldError>Password and Confirm Password not match.</FieldError> : null}
              </Field>
            </FieldSet>
            <Field orientation="horizontal" className="flex w-full justify-between ">
              <Button size="sm" type="submit" className="bg-green-500">Create an Account</Button>
              <Button size="sm" type="button" onClick={() => navigate("/sign-in")}>Sign In</Button>
            </Field>
          </FieldGroup>
        </form>
        {/* {error && <p className="text-red-500">{JSON.stringify(error)}</p>} */}
      </div>
    </div>
  )
}
