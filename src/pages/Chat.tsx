import { FormEvent, useContext, useEffect, useState } from 'react'
import cnfg from '../configuration'
import { getDatabase, onValue, ref, push} from 'firebase/database'
import { appContext } from '../App';
import { Message as MessageType } from '../types/types';
import Message from '../components/Message';

function Chat() {

  const [msgsList,setmsgsList] = useState<MessageType[]>([{uid: "", content: "loading"}])
  const [value,setValue] = useState<string>("")
  const db = getDatabase(cnfg)
  const dbmsgs = ref(db, 'dbmsgs')
  const user = useContext(appContext)[0]

  async function sendMsg(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const msg:MessageType = {uid: user.uid, content: value} 
    push(dbmsgs, msg)
    setValue("")
  }

  useEffect(() => {
    const chat = document.getElementById("chat")
    if(chat) chat.scrollTop = chat.scrollHeight;
    document.getElementById("chatinput")?.focus()
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
    <div className="h-[88vh] bg-neutral-950 text-white flex flex-col">
    <ol id='chat' className='mt-5 mx-5 overflow-y-scroll h-[26rem]'>
      {msgsMarkup}
    </ol>
    <form onSubmit={sendMsg}>
      <input id='chatinput' className='mx-5 w-[96vw] bg-neutral-900 p-3 rounded mt-5 mb-2' type="text" value={value} onChange={e => setValue(e.target.value)} placeholder='send a message'/>
    </form>
    </div>
  )
}

export default Chat