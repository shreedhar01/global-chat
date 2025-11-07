import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Home,
  SignIn,
  SignUp,
  Dashboard
} from "./pages";
import Header from './components/Header';
import { Toaster } from "react-hot-toast"

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
