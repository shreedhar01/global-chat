import React, { useContext, useState } from 'react'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { AuthContextProvider } from '@/contexts/AuthContext'
import GoogleSign from '@/components/GoogleSign'


export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const { setUser } = useContext(AuthContextProvider)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
        email, password
      }, { withCredentials: true })
      setUser(res.data.data)

      toast.success(res.data.message);
      navigate("/dashboard");

    } catch (error: unknown) {
      console.error("Error:", error);
      const axiosError = error as AxiosError<{ message?: string }>
      const msg = axiosError.response?.data?.message || "Something went wrong. Try again."
      toast.error(msg)
    }
  }

  return (
    <div className="first">
      <div className="flex flex-col w-full md:w-7xl h-[90vh] justify-center items-center gap-y-4">
        <h1 className="text-xl">Create a account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 border w-65/100 md:w-25/100 p-4 rounded-xl">
          <FieldGroup>
            <FieldSet>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="ram@gmail.com"
                  onChange={e => setEmail(e.target.value)}
                />
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
            </FieldSet>
            <Field orientation="horizontal" className="flex w-full justify-between ">
              <Button size="sm" type="submit" className='bg-green-500'>Sign In</Button>
              <Button size="sm" type="button" onClick={() => navigate("/sign-up")}>Create an Account</Button>
            </Field>
          </FieldGroup>
        </form>
        <div className='flex w-full justify-center'>
          <p className='font-bold'>OR</p>
        </div>
        <div className='flex w-full justify-center'>
          <GoogleSign />
        </div>
        {/* {data && <p className="text-red-500">{data?._id}</p>} */}
      </div>
    </div>
  )
}
