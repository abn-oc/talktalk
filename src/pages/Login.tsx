import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { auth } from "../configuration";
import { useNavigate } from "react-router-dom";

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
        console.log(result.user)
        console.log("Signed in!")
        navigate('/chat')
    }

    return (
        <>
        <h1>login page</h1>
        <div>
            <p>Enter Email</p>
            <p>Enter Pass</p>
            <p>-OR-</p>
            <button onClick={SignUpWithGoogle}>Continue with Google</button>
        </div>
        </>
    )
}