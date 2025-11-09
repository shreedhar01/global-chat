import { useParams } from "react-router-dom"

export default function Profile() {
    const {_id} = useParams()
  return (
    <div>Profile : {_id}</div>
  )
}
