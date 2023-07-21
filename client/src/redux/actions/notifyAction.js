import { deleteDataAPI, postDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from "./globalTypes"

export const createNotify = ({msg, auth, socket}) => async (dispatch) => {
    try {
        const res = await postDataAPI('notify', msg, auth.token)
        console.log(res.data)
        socket.emit('createNotify', {
            ...res.data.notify,
            user: {
                username: auth.user.username,
                avatar: auth.user.avatar
            }
        })
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}
export const removeNotify = ({msg, auth, socket}) => async (dispatch) => {
    try {
       const res = deleteDataAPI(`notify/${msg.id}?url=${msg.url}`, auth.token)
        // await deleteDataAPI(`notify/${msg.id}?url=${msg.url}`, auth.token)
        
        // socket.emit('removeNotify', msg)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}
