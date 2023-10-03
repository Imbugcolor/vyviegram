import React, { useEffect, useState, useRef } from 'react'
import UserCard from '../UserCard'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import MsgDisplay from './MsgDisplay'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { videoShow, imageShow } from '../../utils/mediaShow'
import Icons from '../Icons'
import { imageUpload } from '../../utils/imageUpload'
import { addMessage, deleteConversation, getMessages, handleReadMessage, loadMoreMessages } from '../../redux/actions/messageAction'
import LoadIcon from '../../images/loading.gif'
import { TbPhoto } from 'react-icons/tb'
import Avatar from '../Avatar'
import stylePopUpConfirm from '../alert/Confirm'
import { BsTelephone } from 'react-icons/bs'
import { HiOutlineVideoCamera } from 'react-icons/hi2'
import { MdDeleteOutline } from 'react-icons/md'

const RightSide = () => {
    const { auth, message, theme, socket, peer } = useSelector(state => state)
    const dispatch = useDispatch()

    const { id } = useParams()
    const [user, setUser] = useState([])
    const [text, setText] = useState('')
    const [media, setMedia] = useState([])
    const [isRead, setIsRead] = useState(false)
    const [sender, setSender] = useState('')
    const [loadMedia, setLoadMedia] = useState(false)

    const refDisplay = useRef()
    const pageEnd = useRef()

    const [data, setData] = useState([])
    const [result, setResult] = useState(9)
    const [page, setPage] = useState(0)
    const [isLoadMore, setIsLoadMore] = useState(0)
    const [load, setLoad] = useState(false)

    const navigate = useNavigate()

    // If data loaded, get data in Redux Store
    useEffect(() => {
        const newData = message.data.find(item => item._id === id)
        if(newData) {
            setData(newData.messages)
            setResult(newData.result)
            setPage(newData.page)
        }
        
    },[message.data, id, message.users])

    useEffect(() => {
        if(auth) {
            const conversation = message.users.find(item => item._id === id)
            if(conversation) {
                setIsRead(conversation.isRead)
                setSender(conversation.sender)
            }
            if(conversation && conversation.sender === id && !conversation.isRead) {
                dispatch(handleReadMessage({ auth, id, socket }))
            }
        }
    },[message.users, id, auth, dispatch, socket])

    useEffect(() => {
        if(id && message.users.length > 0) {
            // auto scroll down to newest message when open a box chat
            setTimeout(() => {
                refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
            }, 50)

            // get user in redux base on id param
            const newUser = message.users.find(user => user._id === id)
            if(newUser) setUser(newUser)
        }
    }, [message.users, id])

    const handleChangeMedia = (e) => {
        const files = [...e.target.files]
        
        let err = ''
        let newMedia = []
        const types = ['image/png', 'image/jpeg', 'video/mp4', 'video/x-m4v', 'video/webm', 'video/m4v']

        files.forEach(file => {
            if(!file) return err = 'File does not exist.'

            if(file.size > 1024 * 1024 * 25) {
                return err = 'The image/video largest is 25mb.'
            }

            if(!types.includes(file.type))
                return err = 'The image/video is not support.'

            return newMedia.push(file)
        })

        if(err) dispatch({type: GLOBALTYPES.ALERT, payload: {error: err}})

        setMedia([...media, ...newMedia])
        
        e.target.value = null
    }

    const handleDeleteMedia = (index) => {
        const newArr = [...media]
        newArr.splice(index, 1)
        setMedia(newArr)
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!text.trim() && media.length === 0) return;
        setText('')
        setMedia([])
        setLoadMedia(true)

        let newArr = []
        if(media.length > 0) newArr = await imageUpload(media)

        const msg = {
            sender: auth.user._id,
            recipient: id,
            text,
            media: newArr,
            createdAt: new Date().toISOString()
        }

        setLoadMedia(false)

        await dispatch(addMessage({msg, auth, socket}))
        if(refDisplay.current) {
            refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
        }
    }

    useEffect(() => {
        // get messages data each conversation
        const getMessagesData = async () => {
            setLoad(true)
            // if data id is not exist, get messages data
            if(message.data.every(item => item._id !== id)) {
                await dispatch(getMessages({auth, id}))
                setTimeout(() => {
                    refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
                }, 50)
            }
            setLoad(false)
        }

        getMessagesData()
    },[id, auth, dispatch, message.data])

    // Load more
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting) {
                setIsLoadMore(p => p + 1)
            }
        }, { threshold: 0.1 })

        observer.observe(pageEnd.current)
    },[setIsLoadMore])

    useEffect(() => {
        if(isLoadMore > 1) {
            if(result >= page * 9) {
                dispatch(loadMoreMessages({auth, id, page: page + 1}))
                setIsLoadMore(1);
            }
        }
    // eslint-disable-next-line 
    },[isLoadMore])

    const handleDeleteConversation = () => {
        stylePopUpConfirm.fire({
            text: "Delete conversation?",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteConversation({auth, id}))
                return navigate('/message')
            } 
        })
    }

    // Call
    const caller = ({video}) => {
        const { _id, avatar, username, fullname } = user
        
        const msg = {
            sender: auth.user._id,
            recipient: _id,
            avatar, username, fullname, video
        }

        dispatch({type: GLOBALTYPES.CALL, payload: msg})

    }

    const callUser = ({video}) => {
        const { _id, avatar, username, fullname } = auth.user

        const msg = {
            sender: _id,
            recipient: user._id,
            avatar, username, fullname, video
        }

        if(peer.open) msg.peerId = peer._id

        socket.emit('callUser', msg)
    }

    const handleAudioCall = () => {
        caller({video: false})
        callUser({video: false})
    }

    const handleVideoCall = () => {
        caller({video: true})
        callUser({video: true})
    }

    //Typing Text Chat..
    const handleTyping = () => {
        socket.emit('typing', {sender: auth.user, recipient: user})
    }

    return (
        <>
            <div className='message_header' style={{cursor: 'pointer'}}>
                {
                    user.length !== 0 &&
                    <UserCard user={user}>
                        <div className='options__message_header'>
                            <BsTelephone
                            onClick={handleAudioCall}/>
                            <HiOutlineVideoCamera
                            onClick={handleVideoCall}/>
                            <MdDeleteOutline
                            onClick={handleDeleteConversation}/>
                        </div>
                    </UserCard>
                }
            </div>
            
            <div className='chat_container'>
                <div className='chat_display' ref={refDisplay}>
                    <button style={{marginTop: '-25px', opacity: 0}} ref={pageEnd}>Load more</button>
                    {
                        load ? <div className='loading_conversation'>
                            <img src={LoadIcon} alt='loading'/>
                        </div> :
                        <>
                            {
                                data.map((msg, index) => (
                                    <div key={index}>
                                        {
                                            msg.sender !== auth.user._id &&
                                            <div className='chat_row other_message'>
                                                <MsgDisplay user={user} msg={msg} theme={theme} />
                                            </div>
                                        }

                                        {
                                            msg.sender === auth.user._id &&
                                            <div className='chat_row you_message'>
                                                <MsgDisplay user={auth.user} msg={msg} theme={theme} data={data}/>
                                            </div>
                                        }
                                    </div>
                                ))
                            }

                            {
                                sender === auth.user._id && isRead &&
                                <div className='txt_seen_message'>Seen</div>
                            }

                            {
                                loadMedia &&
                                <div className='chat_row you_message'>
                                    <img src={LoadIcon} alt='loading' />
                                </div>
                            }

                            {
                            user.typing && 
                            <div className='user_typing'>
                                    <Avatar src={user.avatar} size='mess-avatar'/>
                                    <div className='typing_text'>
                                        <span>{user.fullname} is typing...</span>
                                    </div>
                            </div>
                            }
                        </>
                    }
                </div>
            </div>

            <div className='show_media' style={{ display: media.length > 0 ? 'grid' : 'none' }}>
                {
                    media.map((item, index) => (
                        <div key={index} id='file_media'>
                            {
                                item.type.match(/video/i) ?
                                videoShow(URL.createObjectURL(item), theme) :
                                imageShow(URL.createObjectURL(item), theme)
                            }
                            <span onClick={() => handleDeleteMedia(index)}>&times;</span>
                        </div>
                    ))
                }
            </div>

            <form className='chat_input' onSubmit={handleSubmit}>
                <Icons setContent={setText} content={text} theme={theme}/>
                <input type='text' 
                placeholder='Enter you message...'
                value={text} onChange={e => setText(e.target.value)}
                onKeyPress={handleTyping}
                style={{
                    filter: theme ? 'invert(1)' : 'invert(0)',
                    background: theme ? '#040404' : '',
                    color: theme ? 'white' : ''
                }}
                />

                <div className='file_upload'>            
                    <TbPhoto style={{fontSize: '26px', marginRight: '10px'}}/>
                    <input type='file' name='file' id='file'
                    multiple accept='image/*, video/*' onChange={handleChangeMedia}/>
                </div>

                <button type='submit' className='material-icons'
                disabled={(text || media.length > 0) ? false : true}>
                    near_me
                </button>
            </form>
        </>
    )
}

export default RightSide
