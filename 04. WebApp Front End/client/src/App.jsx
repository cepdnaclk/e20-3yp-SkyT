import './App.css'
import Login from './Components/Login/Login'
import Dashboard from './Components/Dashboard/Dashboard'

import Register from './Components/Register/Register'


//Import react router dom
import{
  createBrowserRouter,
  RouterProvider
}from 'react-router-dom'


const router=createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  }
])


function App() {

  return (
    <div>
      <RouterProvider router={router}/>
      
    </div>
  )
}

export default App
