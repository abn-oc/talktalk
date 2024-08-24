import { createContext, useEffect, useState } from "react"
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Login from "./pages/Login"
import Chat from "./pages/Chat"
import './App.css'
import { onAuthStateChanged, User } from "firebase/auth"
import Profile from "./pages/Profile"
import { appUser } from "./types/types"
import CreateAcc from "./pages/CreateAcc"
import cnfg, { auth } from "./configuration"
import { get, getDatabase, ref } from "firebase/database"
import { CgProfile } from "react-icons/cg";
import { GoSignOut } from "react-icons/go";
import { PulseLoader } from "react-spinners"

export const appContext = createContext<any>(null) 

function App() {
    
    const location = useLocation()
    const navigate = useNavigate()
    const db = getDatabase(cnfg)
    const [user, setUser] = useState<null | User>(null)
    const [appUser, setAU] = useState<null | appUser>(null)
    const [h,setH] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {(async () => {
        onAuthStateChanged(auth, async (currentUser) => {
            if(currentUser && location.pathname != '/') {
                setUser(currentUser);
                const dbref = ref(db, `users/${currentUser.uid}`)
                const ss = await get(dbref)
                if(ss.exists()) setAU(ss.val())
            }
        })
    })()}, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            const dropbox = document.getElementById("dropbox")
            if (dropbox && !dropbox.contains(e.target as Node)) {
                setH(false)
            }
        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        };
    }, []);

    return (
        <>
        <div className="h-[12vh] bg-neutral-950 border-b-2 border-solid border-white text-white flex items-center">
        <Link to={user? '/chat': '/'} className="ml-4 font-bold text-4xl">talktalkk</Link>
        <div className="ml-auto mr-4">
        {user? <button className="hover:underline underline-offset-8 flex flex-row items-center text-lg" onClick={(e) => {e.stopPropagation();setH(!h)}}>{appUser? appUser.username: "loading"} <img src={appUser? appUser.pfp: "/public/assets/spinner.gif"} width={40} className="ml-2 rounded-full"/></button>: <button >no user logged in</button>}
        {h? <div id="dropbox" className="w-[7.8rem] bg-white text-gray-700 absolute right-3 z-10 flex flex-col rounded py-2 ">
            <button className="flex flex-row items-center h-9 px-2 hover:bg-gray-200 active:bg-gray-300" onClick={() => {setH(false);navigate('/profile')}}>Profile<CgProfile className="size-5 ml-auto"/></button>
            <button className="flex flex-row items-center h-9 px-2 hover:bg-gray-200 active:bg-gray-300" onClick={() => {setH(false);setUser(null);navigate('/')}}>Sign Out<GoSignOut className="size-5 ml-auto"/></button>
        </div>:<></>}
        </div>
        </div>
        {loading? <div className="absolute w-[100vw] h-[88vh] bg-neutral-950 flex flex-col items-center justify-center">
        <PulseLoader color="#ffffff" />
        </div>:<></>}
        <appContext.Provider value={[user, setUser, appUser, setAU, setLoading]}>        
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