import { DataSnapshot, get, getDatabase, ref, set } from "firebase/database"
import { FormEvent, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import cnfg from "../configuration"
import { appContext } from "../App"
import { getDownloadURL, getStorage, ref as refs } from "firebase/storage"

export default function Profile() {

    const user = useContext(appContext)[0]
    const setAU = useContext(appContext)[3]
    const db = getDatabase(cnfg)
    const dbref = ref(db, `users/${user.uid}`)
    const st = getStorage()
    const stref = refs(st, `${user.uid}/lain.jpg`)
    const navigate = useNavigate()
    const [value, setValue] = useState<string>("loading...")

    async function updateProfile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const URL = await getDownloadURL(stref)
        console.log(URL)
        await set(dbref, {username: value, pfp: URL})
        //setting lain as pfp lol
        const ss: DataSnapshot = await get(dbref)
        if(ss.exists()) setAU(ss.val())
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