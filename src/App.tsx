import { createContext, useEffect, useState } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import Login from "./pages/Login"
import Chat from "./pages/Chat"
import './App.css'
import { onAuthStateChanged, User } from "firebase/auth"
import Profile from "./pages/Profile"
import { appUser } from "./types/types"
import CreateAcc from "./pages/CreateAcc"
import cnfg, { auth } from "./configuration"
import { get, getDatabase, ref } from "firebase/database"

export const appContext = createContext<any>(null) 

function App() {
    
    const db = getDatabase(cnfg)
    const [user, setUser] = useState<null | User>(null)
    const [appUser, setAU] = useState<null | appUser>(null)

    useEffect(() => {(async () => {
        onAuthStateChanged(auth, async (currentUser) => {
            if(currentUser && useLocation().pathname != '/') {
                setUser(currentUser);
                const dbref = ref(db, `users/${currentUser.uid}`)
                const ss = await get(dbref)
                if(ss.exists()) setAU(ss.val())
            }
        })
    })()}, []);

    return (
        <>
        <h1>Current User: {user? user.displayName: 'no user logged in'}</h1>
        <appContext.Provider value={[user, setUser, appUser, setAU]}>        
        <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/chat' element={user? <Chat/>: <></>}/>
        <Route path='/profile' element={user? <Profile/>: <></>}/>
        <Route path='/create-account' element={<CreateAcc/>}/>
        </Routes>
        </appContext.Provider>
        </>
    )
}

export default App