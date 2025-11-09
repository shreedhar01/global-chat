import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {
  Home,
  SignIn,
  SignUp,
  Dashboard,
  Profile
} from "./pages";
import Header from './components/Header';
import { Toaster } from "react-hot-toast"
import { useContext } from 'react';
import { AuthContextProvider } from './contexts/AuthContext';

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

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile/:_id' element={<Profile />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

const ProtectedRoute = () => {
  const { user } = useContext(AuthContextProvider)
  if (!user) {
    return <Navigate to="/sign-up" replace />
  }
  return <Outlet />
}
