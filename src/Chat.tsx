import './App.css'
import { FormEvent, useContext, useEffect, useState } from 'react'
import cnfg from './configuration'
import { getDatabase, onValue, ref, push} from 'firebase/database'
import { getAuth, signOut } from "firebase/auth";
import { userContext } from './App';
import { useNavigate } from 'react-router-dom';

function Chat() {

  const [msgsList,setmsgsList] = useState<string[]>(["loading..."])
  const [value,setValue] = useState<string>("")
  const user = useContext(userContext)
  const navigate = useNavigate()

  const db = getDatabase(cnfg)
  const dbmsgs = ref(db, 'dbmsgs')

  async function sendMsg(e: FormEvent<HTMLFormElement>, item: string) {
    e.preventDefault()
    const msg = item
    push(dbmsgs, msg)
    setValue("")
  }

  function SignOutt() {
    // signOut(getAuth()) iske bad setUser(null) krdia tha but
    navigate('/')
  }

  useEffect(() => {
    onValue(dbmsgs, snapshot => {
      const ss = snapshot.val() || {}
      const vals: string[] = Object.values(ss)
      setmsgsList(vals)
    })
  }, [])

  let msgsMarkup = msgsList.map(a => <li>{a}</li>)

  return (
    <>
    <h1>hello</h1>
    <ol>
      {msgsMarkup}
    </ol>
    <form onSubmit={(e) => sendMsg(e,value)}>
      <input type="text" value={value} onChange={e => setValue(e.target.value)}/>
    </form>
    <button onClick={SignOutt}>sign out</button>
    </>
  )
}

export default Chat
