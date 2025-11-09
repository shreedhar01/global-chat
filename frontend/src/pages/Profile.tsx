import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthContextProvider } from "@/contexts/AuthContext"
import axios, { AxiosError } from "axios"
import React, { useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
// import { useParams } from "react-router-dom"

interface IUserInfo {
  _id: string,
  username: string,
  email: string,
  isOnline: string,
  createdAt: string,
  updatedAt: string
}

export default function Profile() {
  const { setUser } = useContext(AuthContextProvider)
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null)
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    const userData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/self`, { withCredentials: true })
        console.log(res.data)
        setUserInfo(res.data.data.user)
        setName(res.data.data.user.username)
        console.log(userInfo)
      } catch (error: unknown) {
        console.error("Error:", error);
        const axiosError = error as AxiosError<{ message?: string }>
        const msg = axiosError.response?.data?.message || "Something went wrong. Try again."
        toast.error(msg)
      }
    }

    userData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/user`, {
        username: name
      }, { withCredentials: true })
      toast.success(res.data.message)
      setEdit(false)
      setUser({ _id: res.data.data._id, username: res.data.data.username })
    } catch (error: unknown) {
      console.error("Error:", error);
      const axiosError = error as AxiosError<{ message?: string }>
      const msg = axiosError.response?.data?.message || "Something went wrong. Try again."
      toast.error(msg)
    }
  }

  return (
    <div className="first">
      <div className="flex flex-col items-center justify-center w-full md:w-7xl">
        <div className="w-full">
          <Link to="/dashboard" className="bg-green-500 hover:bg-green-300 p-2 rounded">Back</Link>
          <div className="flex items-center justify-between m-4 w-full">
            <div className="flex items-center justify-center bg-neutral-500 w-32 h-32 rounded-full">
              <p className="text-7xl font-bold">{name[0]}</p>
            </div>
            <p className="text-5xl font-medium">{name} profile</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-50/100 md:w-25/100 border p-4 rounded-2xl">
          <div className="flex flex-col gap-2">
            <p className="text-neutral-400">Your Name</p>
            <Input value={name} disabled={!edit} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-neutral-400">Your Email</p>
            <Input value={userInfo?.email} disabled />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-neutral-400">You create ID at:</p>
            <Input value={userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : ""} disabled />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-neutral-400">Your update ID at:</p>
            <Input value={userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : ""} disabled />
          </div>
          <div className="flex w-full justify-between">
            <Button onClick={() => setEdit(true)} type="button">Edit</Button>
            <Button type="submit" disabled={!edit}>Save</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
