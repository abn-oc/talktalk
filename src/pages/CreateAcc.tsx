import { createUserWithEmailAndPassword } from "firebase/auth"
import { FormEvent, useState } from "react"
import { auth } from "../configuration"
import { useNavigate } from "react-router-dom"

export default function CreateAcc() {

    const navigate = useNavigate()
    const [em, setEM] = useState<string>("")
    const [pass,setPass] = useState<string>("")
    const [errmsg, setErrmsg] = useState<string>("")

    async function createAccount(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try{
            await createUserWithEmailAndPassword(auth, em, pass)
            navigate('/')
        }
        catch(error: any) {
            console.log(`error:${error.code}`)
            setErrmsg(error.code.substr(5))
        }
    }

    return (
        <div className="h-[88vh]  bg-neutral-950 text-white flex flex-col items-center justify-center">
        <div className="flex flex-col">
        <p className="mb-3 mr-auto font-bold text-2xl">Create Account:</p>
        <p className="text-red-500 text-sm mx-auto mb-2.5">{errmsg}</p>
        <form className="flex flex-col items-center" onSubmit={createAccount}>
            <input className="bg-neutral-900 p-3 rounded mb-2.5" type="text" value={em} onChange={e => setEM(e.target.value)} placeholder="email"/>
            <input className="bg-neutral-900 p-3 rounded mb-5" type="text" value={pass} onChange={e => setPass(e.target.value)} placeholder="password"/>
            <button className="active:bg-black active:text-white border border-white border-solid p-3 rounded mb-5 hover:bg-neutral-300 hover:text-black">Create Account</button>
        </form>
        </div>
        </div>
    )
}