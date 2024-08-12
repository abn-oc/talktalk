import { useEffect, useState } from 'react';
import cnfg from '../configuration'
import { getDatabase, ref, get} from 'firebase/database'

export default function useUID(uid:string | undefined) {

    const [un,setUN] = useState(null)

    useEffect(() => {
        (async() => {
            const db = getDatabase(cnfg)
            const refu = ref(db, `users/${uid}`)
            const val = (await get(refu)).val()
            if(val == undefined) {
                return;
            }
            setUN(val.username)
            return;
        })()
    }, [uid])

    return {username: un};
}