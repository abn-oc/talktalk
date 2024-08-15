import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User } from "firebase/auth";
import cnfg, { auth } from "../configuration";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { get, getDatabase, ref } from "firebase/database";

export default function Login({setUser}:{setUser: React.Dispatch<React.SetStateAction<User | null>>}) {

    const navigate = useNavigate()

    async function SignUpWithGoogle() {
        const provider = new GoogleAuthProvider();
    
        const result=await signInWithPopup(auth, provider)
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential){
          console.error("Error in user Credential")
          return
        }
        setUser(result.user)
        const db = getDatabase(cnfg)
        const refu = ref(db, `users/${result.user.uid}`)
        const valu = await get(refu)
        const val = valu.val()
        if(valu && val && val.username) navigate('/chat')
        else navigate('/account')
    }

    const [em, setEM] = useState<string>("")
    const [pass, setPass] = useState<string>("")

    async function login(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log("loggingin")
        try {
          const creds = await signInWithEmailAndPassword(auth, em, pass)
          setUser(creds.user)
          navigate('/chat')
        } 
        catch (error: any) {
          console.log(`error: ${error.code}`)
        }
    }

    return (
        <>
        <h1>login page</h1>
        <div>
            <form onSubmit={e => login(e)}>
                <input type="text" value={em} onChange={e => setEM(e.target.value)} placeholder="email"/>
                <input type="text" value={pass} onChange={e => setPass(e.target.value)} placeholder="password"/>
                <button>login</button>
            </form>
            <button onClick={() => navigate('/accountcreation')}>Create Account</button>
            <p>-OR-</p>
            <button onClick={SignUpWithGoogle}>Continue with Google</button>
        </div>
        </>
    )
}