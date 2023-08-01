import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { POST_TYPES } from './redux/actions/postAction'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import { NOTIFY_TYPES } from './redux/actions/notifyAction'
import audiobell from "./audio/Anh Yêu Em_Anh Khang_-1074080922.mp3"
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
    const {auth, socket, notify} = useSelector(state => state)
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
    },[socket, dispatch])

    useEffect(() => {
        socket.on('removeNotifyToClient', msg =>{
            dispatch({type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg})
        })

        return () => socket.off('removeNotifyToClient')
    },[socket, dispatch])

  return (  
    <>
        <audio controls ref={audioRef} style={{display: 'none'}}>
            <source src={audiobell} type="audio/mp3"/>    
        </audio>
    </>
  )
}

export default SocketClient
