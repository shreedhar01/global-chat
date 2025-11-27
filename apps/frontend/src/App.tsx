import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {
  Home,
  SignIn,
  SignUp,
  Dashboard,
  Profile,
  NotFound
} from "./pages";
import Header from './components/Header';
import { Toaster } from "react-hot-toast"
import { useContext } from 'react';
import { AuthContextProvider } from './contexts/AuthContext';
import { Loading } from './components/Loading';

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

        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

const ProtectedRoute = () => {
  const { user,loading } = useContext(AuthContextProvider)
  if (loading) {
    return <Loading text='Authenticate'></Loading>
  }

  return user ? <Outlet /> : <Navigate to="/sign-in" replace />;
}
