import { DataSnapshot, get, getDatabase, ref } from "firebase/database"
import {appUser, Message as MessageType} from "../types/types"
import cnfg from "../configuration"
import { useEffect, useState } from "react"

export default function Message({msg}:{msg:MessageType}) {

    const db = getDatabase(cnfg)
    const dbref = ref(db, `users/${msg.uid}`)
    const [ua, setua] = useState<null | appUser>(null)


    if(typeof msg === 'string') {
        return (
            <>
            <p>loading...</p>
            </>
        )
    }

    useEffect(() => {(async () => {
        const ss: DataSnapshot = await get(dbref)
        if(ss.exists()) {
            setua(ss.val())
        }
    })()},[])

    return (
        <>
        <div style={{display: "flex", flexDirection: "row"}}>
        <img src={ua? ua.pfp: 'src/assets/spinner.gif'} width={50}/>
        <p>{ua?.username}:</p>
        <p>{msg.content}</p>
        </div>
        </>
    )
}