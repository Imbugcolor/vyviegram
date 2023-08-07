import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { POST_TYPES } from './redux/actions/postAction'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import { NOTIFY_TYPES } from './redux/actions/notifyAction'
import audiobell from "./audio/Anh Yêu Em_Anh Khang_-1074080922.mp3"
import { MESS_TYPES } from './redux/actions/messageAction'
const spawnNotifications =(body, icon, url, title) => {
    let options = {
        body, icon
    }
    let n = new Notification(title, options)
    n.onclick = e => {
        e.preventDefault()
        window.open(url, '_blank')
    }
}
const SocketClient = () => {
    const { auth, socket, notify, online, call } = useSelector(state => state)
    const dispatch = useDispatch()
    const audioRef = useRef()

    //joinUser
    useEffect(() => {
        socket.emit('joinUser', auth.user)// gửi user tới server
    }, [socket, auth.user]);
    
    //likes
    useEffect(() => {
        socket.on('likeToClient', newPost =>{
            dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
        })

            //  nhan lai tu server
        return () => socket.off('likeToClient')
    }, [socket, dispatch]);
    //unlikes
    useEffect(() => {
        socket.on('unLikeToClient', newPost =>{
            dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
        })

            //  nhan lai tu server
        return () => socket.off('unLikeToClient')
    }, [socket, dispatch]);

    //Comments
    useEffect(() => {
        socket.on('createCommentToClient', newPost =>{
            dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
        })

        return () => socket.off('createCommentToClient')
    },[socket, dispatch])

    //Delete
    useEffect(() => {
        socket.on('deleteCommentToClient', newPost =>{
            dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
        })

        return () => socket.off('deleteCommentToClient')
    },[socket, dispatch])

   // Follow
   useEffect(() => {
    socket.on('followToClient', newUser =>{
        
        dispatch({type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})
        // console.log(newUser)
    })

    return () => socket.off('followToClient')
    },[socket, dispatch, auth])

    useEffect(() => {
        socket.on('unFollowToClient', newUser =>{
            dispatch({type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})
        })

        return () => socket.off('unFollowToClient')
    },[socket, dispatch, auth])
    
    //Notifications
    useEffect(() => {
        socket.on('createNotifyToClient', msg =>{
            dispatch({type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg})
            if(notify.sound) audioRef.current.play()
            spawnNotifications(
                msg.user.username + ' ' + msg.text,
                msg.user.avatar,
                msg.url,
                'V-NETWORK'
            )
        })

        return () => socket.off('createNotifyToClient')
    },[socket, dispatch, notify.sound])

    useEffect(() => {
        socket.on('removeNotifyToClient', msg =>{
            dispatch({type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg})
        })

        return () => socket.off('removeNotifyToClient')
    },[socket, dispatch])

    //Message
    useEffect(() => {
        socket.on('addMessageToClient', msg => {
            dispatch({type: MESS_TYPES.UPDATE_TYPING, payload: { _id: msg.sender, typing: false }})
            dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg})
            dispatch({
                type: MESS_TYPES.ADD_USER, 
                payload: {
                    ...msg.user,
                    text: msg.text,
                    media: msg.media
                }
            })
        })

        return () => socket.off('addMessageToClient')
    },[socket, dispatch])

    useEffect(() => {
        socket.on('deleteMessagesToClient', data => {
            dispatch({type: MESS_TYPES.DELETE_MESSAGES, payload: { newData: data.newData, _id: data.user }})
        })

        return () => socket.off('deleteMessagesToClient')
    },[socket, dispatch])

    //Typing Message 
    useEffect(() => {
        socket.on('typingToClient', data => {
            dispatch({type: MESS_TYPES.UPDATE_TYPING, payload: { _id: data.sender._id, typing: true }})

            setTimeout(() => {
                dispatch({type: MESS_TYPES.UPDATE_TYPING, payload: { _id: data.sender._id, typing: false }})
            }, 3000)
        })

        return () => socket.off('typingToClient')
    },[socket, dispatch])

    // Check User Online / Offline
    useEffect(() => {
        socket.emit('checkUserOnline', auth.user)
    },[socket, auth.user])

    useEffect(() => {
        socket.on('checkUserOnlineToMe', data => {
            data.forEach(item => {
                if(!online.includes(item.id)) {
                    dispatch({type: GLOBALTYPES.ONLINE, payload: item.id})    
                }
            })
        })

        return () => socket.off('checkUserOnlineToMe')
    },[socket, dispatch, online])

    useEffect(() => {
        socket.on('checkUserOnlineToClient', id => {
            if(!online.includes(id)) {
                dispatch({type: GLOBALTYPES.ONLINE, payload: id})    
            }
        })

        return () => socket.off('checkUserOnlineToClient')
    },[socket, dispatch, online])

    useEffect(() => {
        socket.on('checkUserOffline', id => {
            dispatch({type: GLOBALTYPES.OFFLINE, payload: id})
        })

        return () => socket.off('checkUserOffline')
    },[socket, dispatch, online])

    // Call user
    useEffect(() => {
        socket.on('callUserToClient', data => {
            dispatch({type: GLOBALTYPES.CALL, payload: data})
        })

        return () => socket.off('callUserToClient')
    },[socket, dispatch, online])

    useEffect(() => {
        socket.on('userBusy', data => {
            dispatch({type: GLOBALTYPES.ALERT, payload: {error: `${call.fullname} is busy.`}})
        })

        return () => socket.off('userBusy')
    },[socket, dispatch, online, call])

  return (  
    <>
        <audio controls ref={audioRef} style={{display: 'none'}}>
            <source src={audiobell} type="audio/mp3"/>    
        </audio>
    </>
  )
}

export default SocketClient
