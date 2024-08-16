import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import cnfg, { auth } from "../configuration";
import { useNavigate } from "react-router-dom";
import { FormEvent, useContext, useState } from "react";
import { appContext } from "../App";
import { DataSnapshot, get, getDatabase, ref } from "firebase/database";

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
        <h1>Login</h1>
        <div>
            <form onSubmit={e => login(e)}>
                <input type="text" value={em} onChange={e => setEM(e.target.value)} placeholder="email"/>
                <input type="text" value={pass} onChange={e => setPass(e.target.value)} placeholder="password"/>
                <button>login</button>
            </form>
            <button onClick={() => navigate('/create-account')}>Create Account</button>
            <p>-OR-</p>
            <button onClick={SignUpWithGoogle}>Continue with Google</button>
        </div>
        </>
    )
}