import { createContext, useState } from "react"
import { Route, Routes } from "react-router-dom"
import Chat from "./Chat"
import Login from "./Login"
import './App.css'
import { User } from "firebase/auth"

export const userContext = createContext<User | null>(null) 

function App() {
    
    const [user,setUser] = useState<User | null>(null)
    
    return (
        <>
        <Routes>
        <Route path='/' element={<Login setUser={setUser}/>}/>
        <Route path='/chat' element={<userContext.Provider value={user}><Chat/></userContext.Provider>}/>
        </Routes>
        </>
    )
}

export default App