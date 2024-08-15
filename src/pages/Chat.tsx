import { FormEvent, useContext, useEffect, useState } from 'react'
import cnfg from '../configuration'
import { getDatabase, onValue, ref, push} from 'firebase/database'
import { useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import useUID from '../hooks/useUID';

function Chat() {

  const [msgsList,setmsgsList] = useState<string[]>(["loading..."])
  const [value,setValue] = useState<string>("")
  const navigate = useNavigate()
  const db = getDatabase(cnfg)
  const dbmsgs = ref(db, 'dbmsgs')
  const user = useContext(userContext)
  const userApp = useUID(user?.uid)

  async function sendMsg(e: FormEvent<HTMLFormElement>, item: string) {
    e.preventDefault()
    const msg = `${userApp?.username}:${item}`
    push(dbmsgs, msg)
    setValue("")
  }

  function SignOutt() {
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
    <h1>Chat</h1>
    <ol>
      {msgsMarkup}
    </ol>
    <form onSubmit={(e) => sendMsg(e,value)}>
      <input type="text" value={value} onChange={e => setValue(e.target.value)}/>
    </form>
    <button onClick={() => navigate('/account')}>profile</button>
    <button onClick={SignOutt}>sign out</button>
    </>
  )
}

export default Chat
