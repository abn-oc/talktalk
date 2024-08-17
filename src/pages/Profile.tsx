import { DataSnapshot, get, getDatabase, ref, set } from "firebase/database"
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import cnfg from "../configuration"
import { appContext } from "../App"
import { getDownloadURL, getStorage, ref as refs, uploadBytes } from "firebase/storage"
import imageCompression from "browser-image-compression"

export default function Profile() {

    const user = useContext(appContext)[0]
    console.log(user.uid)
    const setAU = useContext(appContext)[3]
    const db = getDatabase(cnfg)
    const dbref = ref(db, `users/${user.uid}`)
    const st = getStorage()
    const stref = refs(st, `${user.uid}/lain.jpg`)
    const navigate = useNavigate()
    const [value, setValue] = useState<string>("loading...")
    const [URL, setURL] = useState<string>('src/assets/spinner.gif')

    async function updateProfile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await set(dbref, {username: value, pfp: URL})
        const ss: DataSnapshot = await get(dbref)
        if(ss.exists()) setAU(ss.val())
        navigate('/chat')
    }

    async function uploadpfp(e: ChangeEvent<HTMLInputElement>) {
        const imageFile = e.target.files?.[0];      
        const options = {
          maxSizeMB: 0.01,
          maxWidthOrHeight: 100,
          useWebWorker: true,
        }
        try {
        if(imageFile) {
            const compressedFile = await imageCompression(imageFile, options);      
            await uploadBytes(stref, compressedFile)
            const turl = await getDownloadURL(stref)
            setURL(turl)
        }
        } catch (error) {
          console.log(error);
        }
    }

    useEffect(() => {(async () => {
        const ss: DataSnapshot = await get(dbref)
        if(ss.exists()) {
            setValue(ss.val().username)
            setURL(ss.val().pfp)
        }
        else {
            setValue("")
            setURL("src/assets/defaultpfp.jpg")
        }
    })()}, [])

    return (
        <>
        <h1>Profile:</h1>
        <img src={URL} width={100} />
        <input type="file" id="myfile" onChange={uploadpfp} style={{display: "none"}}/>
        <label htmlFor="myfile"><button type="button" onClick={() => document.getElementById("myfile")?.click()}>Upload an image</button></label>
        <form onSubmit={e => updateProfile(e)}>
            <input type="text" value={value} onChange={e => setValue(e.target.value)}/>
        </form>
        </>
    )
}
