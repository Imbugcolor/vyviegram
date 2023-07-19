import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { POST_TYPES } from './redux/actions/postAction'
import { GLOBALTYPES } from './redux/actions/globalTypes'

const SocketClient = () => {
    const {auth, socket} = useSelector(state => state)
    const dispatch = useDispatch()

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

            //  nhan lai tu server
        return () => socket.off('createCommentToClient')
    }, [socket, dispatch]);

    //Delete
    useEffect(() => {
        socket.on('deleteCommentToClient', newPost =>{
            dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
        })

            //  nhan lai tu server
        return () => socket.off('deleteCommentToClient')
    }, [socket, dispatch]);

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

  return (  
    <div>
      
    </div>
  )
}

export default SocketClient
