import { Routes, Route } from 'react-router'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Home from './components/Home/Home'
import Members from './components/Members/Members'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/members" element={<Members />} />
    </Routes>
  )
}

export default App
