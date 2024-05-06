import { DeleteData, GLOBALTYPES } from './globalTypes'
import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from '../../utils/fetchData'

export const MESS_TYPES = {
    ADD_USER: 'ADD_USER',
    ADD_MESSAGE: 'ADD_MESSAGE',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    UPDATE_MESSAGES: 'UPDATE_MESSAGES',
    DELETE_MESSAGES: 'DELETE_MESSAGES',
    UPDATE_TYPING: 'UPDATE_TYPING',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    CHECK_ONLINE_OFFLINE: 'CHECK_ONLINE_OFFLINE',
    UPDATE_READ_MESSAGE: 'UPDATE_READ_MESSAGE'
}

export const addMessage = ({msg, auth, socket}) => async(dispatch) => {
    const { _id, avatar, fullname, username } = auth.user
    try {
        const res = await postDataAPI('message', msg, auth.token, dispatch)
        dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: res.data.newMsg})
        socket.emit('addMessage', {...res.data.newMsg, user: {_id, avatar, fullname, username}})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const getConversations = ({auth, page = 1}) => async(dispatch) => {
    try {
        const res = await getDataAPI(`conversations?limit=${page * 9}`, auth.token, dispatch);
        let newArr = []
   
        // loop conversations to get recipient (_id, fullname, username, avatar)
        res.data.conversations.forEach(item => {
            item.recipients.forEach(cv => {
                if(cv._id !== auth.user._id) {
                    newArr.push({...cv, sender: item.sender, text: item.text, media: item.media, call: item.call, share: item.share, typing: false, isRead: item.isRead})
                }
            })
        })

        dispatch({
            type: MESS_TYPES.GET_CONVERSATIONS, 
            payload: {newArr, result: res.data.result}
        })
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const getMessages = ({ auth, id, page = 1 }) => async(dispatch) => {
    try {
        const res= await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token, dispatch)
        const newData = {...res.data, messages: res.data.messages.reverse()}
        dispatch({type: MESS_TYPES.GET_MESSAGES, payload: {...newData, _id: id, page}})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const loadMoreMessages = ({ auth, id, page = 1 }) => async(dispatch) => {
    try {
        const res= await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token, dispatch)
        const newData = {...res.data, messages: res.data.messages.reverse()}
        dispatch({type: MESS_TYPES.UPDATE_MESSAGES, payload: {...newData, _id: id, page}})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteMessages = ({msg, data, auth, socket}) => async (dispatch) => {
    try {
        await deleteDataAPI(`message/${msg._id}`, auth.token, dispatch)
        
        const newData = DeleteData(data, msg._id)
        dispatch({type: MESS_TYPES.DELETE_MESSAGES, payload: {newData, _id: msg.recipient}})

        socket.emit('deleteMessages', { newData, user: auth.user._id, recipient: msg.recipient })
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteConversation = ({auth, id}) => async (dispatch) => {
    dispatch({type: MESS_TYPES.DELETE_CONVERSATION, payload: id})
    try {
        await deleteDataAPI(`conversation/${id}`, auth.token, dispatch)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const shareToMess = ({post, usersShare, auth, shareMsg, socket}) => async(dispatch) => {

    const msg = {
        sender: auth.user._id,
        text: shareMsg ? shareMsg : '',
        media: [],
        share: post,
        createdAt: new Date().toISOString()
    }

    const { _id, avatar, fullname, username } = auth.user
   
    try {

        dispatch({type: GLOBALTYPES.ALERT, payload: { loading: true }})

        // loop users to share
        await Promise.all(usersShare.map(async(item) => {
            const res = await postDataAPI('message', {...msg, recipient: item._id}, auth.token, dispatch)
            dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: res.data.newMsg})
            socket.emit('addMessage', {...res.data.newMsg, user: {_id, avatar, fullname, username}})
        }))

        dispatch({type: GLOBALTYPES.ALERT, payload: { success: 'Send success.'}})

    } catch (err) {
        console.log(err);
        dispatch({type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg }})
    }
}

export const handleReadMessage = ({auth, id, socket}) => async(dispatch) => { 
    dispatch({type: MESS_TYPES.UPDATE_READ_MESSAGE, payload: { _id: id, isRead: true }})
    try {
        await patchDataAPI(`conversation/read/${id}`, {}, auth.token, dispatch)

        socket.emit('readMessage', { readUser: auth.user._id, sendUser: id })
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg }})
    }
}