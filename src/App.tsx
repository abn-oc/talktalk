import { FormEvent, useEffect, useState } from 'react'
import cnfg, { auth } from './configuration'
import './App.css'
import { getDatabase, onValue, ref, push } from 'firebase/database'
import { SignUpWithGoogle } from './SignUp'
import { getAuth, signOut } from "firebase/auth";
import { signInWithPopup,GoogleAuthProvider } from "firebase/auth";

function App() {

  const [data,setData] = useState(["loading..."])
  const [value,setValue] = useState("")
  const [user, SetUser] = useState(null)

  const db = getDatabase(cnfg)
  const dbcol = ref(db, 'dete')

  function addToList(e: FormEvent<HTMLFormElement>, item: string) {
    if(user) {
      const msg = user.displayName + " says: " + item
      push(dbcol, msg)
      setValue("")
    }
    else {
      const msg = "not-signed-in" + " says: " + item
      push(dbcol, msg)
      setValue("")
    }
    e.preventDefault()
  }

  function SignOutt() {
    const ath = getAuth()
    signOut(ath)
  }

  async function SignUpWithGoogle() {
    const provider = new GoogleAuthProvider();

    const result=await signInWithPopup(auth, provider)
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential){
      console.error("Error in user Credential")
      return
    }
    const token = credential.accessToken;
    SetUser(result.user)
    console.log(user) 
  }

  useEffect(() => {
    onValue(dbcol, snapshot => {
      const ss = snapshot.val() || {}
      const vals = Object.values(ss)
      setData(vals)
      console.log(vals) 
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
