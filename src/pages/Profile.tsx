import { DataSnapshot, get, getDatabase, ref, set } from "firebase/database"
import { FormEvent, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import cnfg from "../configuration"
import { appContext } from "../App"

export default function Profile() {

    const user = useContext(appContext)[0]
    const db = getDatabase(cnfg)
    const dbref = ref(db, `users/${user.uid}`)
    const navigate = useNavigate()
    const [value, setValue] = useState<string>("loading...")

    function updateProfile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        set(dbref, {username: value})
        navigate('/chat')
    }

    useEffect(() => {(async () => {
        const ss: DataSnapshot = await get(dbref)
        if(ss.exists()) setValue(ss.val().username)
        else setValue("")
    })()}, [])

    return (
        <>
        <h1>Profile:</h1>
        <form onSubmit={e => updateProfile(e)}>
            <input type="text" value={value} onChange={e => setValue(e.target.value)}/>
        </form>
        </>
    )
}