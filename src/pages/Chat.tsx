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
    const chat = document.getElementById("chat")
    if(chat) chat.scrollTop = chat.scrollHeight;
  },[msgsList])

  useEffect(() => {
    onValue(dbmsgs, snapshot => {
      const ss = snapshot.val() || {}
      const vals: MessageType[] = Object.values(ss)
      setmsgsList(vals)
    })
  }, [])

  let msgsMarkup = msgsList.map(a => <Message msg={a}/>)

  return (
    <div className="h-[86.7vh] bg-neutral-950 text-white flex flex-col">
    <ol id='chat' className='mt-5 mx-5 overflow-y-scroll h-[26rem]'>
      {msgsMarkup}
    </ol>
    <form onSubmit={sendMsg}>
      <input className='mx-5 w-[96vw] bg-neutral-900 p-3 rounded mt-5' type="text" value={value} onChange={e => setValue(e.target.value)} placeholder='send a message'/>
    </form>
    </div>
  )
}

export default Chat