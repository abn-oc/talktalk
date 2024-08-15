import { createContext, useState } from "react"
import { Route, Routes } from "react-router-dom"
import Chat from "./pages/Chat"
import Login from "./pages/Login"
import './App.css'
import { User } from "firebase/auth"
import Account from "./pages/Account"
import AccountCreate from "./pages/AccountCreate"

export const userContext = createContext<User | null>(null) 

function App() {
    
    const [user,setUser] = useState<User | null>(null)
    
    return (
        <>
        <Routes>
        <Route path='/' element={<Login setUser={setUser} />}/>
        <Route path='/chat' element={<userContext.Provider value={user}><Chat/></userContext.Provider>}/>
        <Route path='/account' element={<userContext.Provider value={user}><Account/></userContext.Provider>}/>
        <Route path="/accountcreation" element={<AccountCreate/>}/>
        </Routes>
        </>
    )
}

export default App