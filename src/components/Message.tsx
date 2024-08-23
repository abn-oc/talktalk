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
        <div className="flex flex-row mt-5 items-center">
        <img className="rounded-full mr-3" src={ua? ua.pfp: 'public/assets/spinner.gif'} width={50}/>
        <div className="flex flex-col">
        <p className="font-bold">{ua?.username}:</p>
        <p>{msg.content}</p>
        </div>
        </div>
    )
}