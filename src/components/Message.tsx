import {Message as MessageType} from "../types/types"

export default function Message({msg}:{msg:MessageType|string}) {

    if(typeof msg === 'string') {
        return (
            <>
            <p>loading...</p>
            </>
        )
    }

    return (
        <>
        <div style={{display: "flex", flexDirection: "row"}}>
        <img src="https://shorturl.at/jWWkl" width={50}/>
        <p>{msg.username}:</p>
        <p>{msg.content}</p>
        </div>
        </>
    )
}