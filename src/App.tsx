import { FormEvent, useEffect, useState } from 'react'
import cnfg, { auth } from './configuration'
import './App.css'
import { getDatabase, onValue, ref, push, set, get } from 'firebase/database'
import { getAuth, signOut, User } from "firebase/auth";
import { signInWithPopup,GoogleAuthProvider } from "firebase/auth";

function App() {

  const [data,setData] = useState<string[]>(["loading..."])
  const [value,setValue] = useState<string>("")
  const [user, setUser] = useState<User | null>(null);

  const db = getDatabase(cnfg)
  const dbcol = ref(db, 'dete')

  async function addToList(e: FormEvent<HTMLFormElement>, item: string) {
    e.preventDefault()
    if(!user) {
      alert("sign in kerke msg bhejskte ho")
      return;
    }
    else if(user && item.startsWith('/sn')) {
      const refn = ref(db, '/users/' + user.displayName)
      const currentName = (await get(refn)).val()
      console.log(currentName)
      const newName = item.substring(3).trim()
      console.log(newName)
      set(refn, newName)
      const msg = `noti:${currentName} changed their username to ${newName}`
      push(dbcol, msg)
      setValue("")
    }
    else if(user) {
      const refn = ref(db, '/users/' + user.displayName)
      const currentName = (await get(refn)).val()
      const msg = currentName + " says: " + item
      push(dbcol, msg)
      setValue("")
    }
    else {
      const msg = "not-signed-in" + " says: " + item
      push(dbcol, msg)
      setValue("")
    }
  }

  function SignOutt() {
    const ath = getAuth()
    signOut(ath)
    setUser(null)
  }

  const SignUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const result=await signInWithPopup(auth, provider)
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential){
      console.error("Error in user Credential")
      return
    }
    const token = credential.accessToken;
    const user = result.user;
    setUser(user)
    // console.log(user,token)  
  }

  useEffect(() => {
    onValue(dbcol, snapshot => {
      const ss = snapshot.val() || {}
      const vals: string[] = Object.values(ss)
      setData(vals)
      // console.log(vals) 
    })
  }, [])

  let detemarkup = data.map(a => <li>{a}</li>)

  return (
    <>
    <h1>hello</h1>
    <ol>
      {detemarkup}
    </ol>
    <form onSubmit={(e) => addToList(e,value)}>
      <input type="text" value={value} onChange={e => setValue(e.target.value)}/>
    </form>
    <button onClick={SignUpWithGoogle}>sign in with google</button>
    <button onClick={SignOutt}>sign out</button>
    </>
  )
}

export default App
