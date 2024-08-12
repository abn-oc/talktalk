import { useContext } from "react"
import { userContext } from "../App"

export default function Account() {

    const user = useContext(userContext)
    console.log(user?.uid)

    return (
        <>
        <h1>Account Details</h1>
        </>
    )
}