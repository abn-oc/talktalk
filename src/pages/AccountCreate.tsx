import { createUserWithEmailAndPassword } from "firebase/auth"
import { FormEvent, useState } from "react"
import { auth } from "../configuration"
import { useNavigate } from "react-router-dom"

export default function AccountCreate() {

    const navigate = useNavigate()
    const [em, setEM] = useState<string>("")
    const [pass,setPass] = useState<string>("")

    async function createAccount(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try{
            await createUserWithEmailAndPassword(auth, em, pass)
            navigate('/')
        }
        catch(error: any) {
            console.log(`error:${error.code}`)
        }
    }

    return (
        <>
        <h1>Create New Account</h1>
        <form onSubmit={createAccount}>
            <input type="text" value={em} onChange={e => setEM(e.target.value)} placeholder="email"/>
            <input type="text" value={pass} onChange={e => setPass(e.target.value)} placeholder="password"/>
            <button>create account</button>
        </form>
        </>
    )
}