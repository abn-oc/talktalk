import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import cnfg, { auth } from "../configuration";
import { useNavigate } from "react-router-dom";
import { FormEvent, useContext, useState } from "react";
import { appContext } from "../App";
import { DataSnapshot, get, getDatabase, ref } from "firebase/database";
import { FcGoogle } from "react-icons/fc";

export default function Login() {

    const db = getDatabase(cnfg)
    const navigate = useNavigate()
    const setUser = useContext(appContext)[1]
    const setAU = useContext(appContext)[3]
    const [em, setEM] = useState<string>("")
    const [pass, setPass] = useState<string>("")


    async function SignUpWithGoogle() {
        const provider = new GoogleAuthProvider();
    
        const result=await signInWithPopup(auth, provider)
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential){
          console.error("Error in user Credential")
          return
        }
        setUser(result.user)
        //if userApp exists send to chat otherwise send to profile
        const UAref = ref(db, `users/${result.user.uid}`)
        const ss: DataSnapshot = await get(UAref)
        if(ss.exists()) {
          setAU(ss.val())
          navigate('/chat')
        }
        else navigate('/profile')
    }

    async function login(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
          const result = await signInWithEmailAndPassword(auth, em, pass)
          setUser(result.user)
          //if userApp exists send to chat otherwise send to profile
          const UAref = ref(db, `users/${result.user.uid}`)
          const ss: DataSnapshot = await get(UAref)
          if(ss.exists()) {
            setAU(ss.val())
            navigate('/chat')
          }
          else navigate('/profile')
        } 
        catch (error: any) {
          console.log(`error: ${error.code}`)
        }
    }

    return (
        <>
        <div className="h-[86.7vh]  bg-neutral-950 text-white flex flex-col items-center justify-center">
            <form className="flex flex-col" onSubmit={e => login(e)}>
                <p className="mb-5 mr-auto font-bold text-2xl">Login with Email/Password:</p>
                <input className="bg-neutral-900 p-3 rounded mb-5" type="text" value={em} onChange={e => setEM(e.target.value)} placeholder="email"/>
                <input className="bg-neutral-900 p-3 rounded mb-5" type="text" value={pass} onChange={e => setPass(e.target.value)} placeholder="password"/>
                <button className="active:bg-blue-900 bg-blue-600 p-3 rounded mb-5 hover:bg-blue-800">login</button>
            </form>
            <button className="active:bg-black border border-white border-solid p-3 rounded mb-5 hover:bg-neutral-900" onClick={() => navigate('/create-account')}>Create Account with Email/Pass</button>
            <button className="active:bg-black border border-white border-solid p-3 rounded mb-5 flex flex-row justify-between items-center hover:bg-neutral-900" onClick={SignUpWithGoogle}>Continue with Google<FcGoogle className="ml-5 size-6"/></button>
          </div>
        </>
    )
}