import { FormEvent, useContext, useEffect, useState } from 'react'
import cnfg from '../configuration'
import { getDatabase, onValue, ref, push} from 'firebase/database'
import { useNavigate } from 'react-router-dom';
import { appContext } from '../App';
import { Message as MessageType } from '../types/types';
import Message from '../components/Message';

function Chat() {

  const [msgsList,setmsgsList] = useState<MessageType[]>([{uid: "", content: "loading"}])
  const [value,setValue] = useState<string>("")
  const navigate = useNavigate()
  const db = getDatabase(cnfg)
  const dbmsgs = ref(db, 'dbmsgs')
  const user = useContext(appContext)[0]
  const setUser = useContext(appContext)[1]
  // const userApp:appUser = useContext(appContext)[2]

  async function sendMsg(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const msg:MessageType = {uid: user.uid, content: value} 
    push(dbmsgs, msg)
    setValue("")
  }

  function SignOutt() {
    setUser(null)
    navigate('/')
  }

  useEffect(() => {
    onValue(dbmsgs, snapshot => {
      const ss = snapshot.val() || {}
      const vals: MessageType[] = Object.values(ss)
      setmsgsList(vals)
    })
  }, [])

  let msgsMarkup = msgsList.map(a => <Message msg={a}/>)

  return (
    <>
    <h1>Chat</h1>
    <ol>
      {msgsMarkup}
    </ol>
    <form onSubmit={sendMsg}>
      <input type="text" value={value} onChange={e => setValue(e.target.value)}/>
    </form>
    <button onClick={SignOutt}>sign out</button>
    </>
  )
}

export default Chat