import { useContext, useState } from "react"
import { userContext } from "../App"
import useUID from "../hooks/useUID"
import { getDatabase, ref, set } from "firebase/database"
import cnfg from "../configuration"
import { useNavigate } from "react-router-dom"

export default function Account() {

    const user = useContext(userContext)
    const appuser = useUID(user?.uid)
    const [val, setVal] = useState(appuser.username? appuser.username: "")
    const db = getDatabase(cnfg)
    const navigate = useNavigate()

    function saveun() {
        set(ref(db, `users/${user?.uid}`), {username: val})
        navigate('/chat')
    }

    return (
        <>
        <h1>Profile Details</h1>
        <form onSubmit={saveun}>
            <input type="text" value={val} onChange={e => setVal(e.target.value)}/>
        </form>
        </>
    )
}