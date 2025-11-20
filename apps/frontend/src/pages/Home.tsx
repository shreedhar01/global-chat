import axios from "axios"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function Home() {
    useEffect(() => {
        const healthCheck = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_API_URL}/health`)
                // toast.success("Backend is up and running")
            } catch (error) {
                console.error("Error:", error);
                toast.error("Backend is spin off need 50 seconds to spin up");
            }
        }
        healthCheck()
    },[])
    return (
        <div className='flex flex-col justify-center items-center w-full px-1 md:px-0 pt-16'>
            <div className='flex flex-col w-full md:w-7xl pt-8 md:pt-16 gap-y-2'>
                <h1 className='text-3xl md:text-5xl font-brand-normal'>
                    <span className='block'>One Room.</span>
                    <span className='block'>Endless Conversations.</span>
                </h1>
                <p className='text-neutral-500 md:w-1/2'>
                    Chat with everyone in real time. Built with the power of modern web tech and Socket.IO magic.
                    Let’s connect the world — one message at a time.
                </p>
            </div>
        </div>
    )
}