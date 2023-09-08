import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '../Avatar'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { addMessage } from '../../redux/actions/messageAction'
import RingRing from '../../audio/ringring.mp3'

const CallModal = () => {
    const { call, auth, peer, socket, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    const [hours, setHours] = useState(0)
    const [mins, setMins] = useState(0)
    const [second, setSecond] = useState(0)
    const [total, setTotal] = useState(0)

    const [answer, setAnswer] = useState(false)

    const youVideo = useRef()
    const otherVideo = useRef()
    const [tracks, setTracks] = useState(null)
    const [newCall, setNewCall] = useState(null)

    // Set time
    useEffect(() => {
        const setTime = () => {
            setTotal(t => t +1)
            setTimeout(setTime, 1000)
        }
        setTime()

        return () => setTotal(0)
    },[])

    // Convert Seconds to Time (hh:mm:ss)
    useEffect(() => {
        setSecond(total%60)
        setMins(parseInt(total/60))
        setHours(parseInt(total/3600))
    },[total])


    // End call
    const addCallMessage = useCallback((call, times, disconnect) => {
        if(call.recipient !== auth.user._id || disconnect) {
            const msg = {
                sender: call.sender,
                recipient: call.recipient,
                text: '',
                media: [],
                call: {video: call.video, times},
                createdAt: new Date().toISOString()
            }
            dispatch(addMessage({msg, auth, socket}))
        }
    },[auth, dispatch, socket])

    const handleEndCall = () => {
        tracks && tracks.forEach(track => track.stop())
        if(newCall) newCall.close()
        let times = answer ? total : 0
        socket.emit('endCall', {...call, times})

        addCallMessage(call, times)
        dispatch({type: GLOBALTYPES.CALL, payload: null})
    }

    // End call after 15s when recipient not response
    useEffect(() => {
        if(answer) {
            setTotal(0)
        } else {
            const timer = setTimeout(() => {
                socket.emit('endCall', {...call, times: 0})
                addCallMessage(call, 0)
                dispatch({type: GLOBALTYPES.CALL, payload: null})
            }, 15000)
    
            return () => clearTimeout(timer)
        }
    },[dispatch, answer, call, socket, addCallMessage])

    // Listen end call other side
    useEffect(() => {
        socket.on('endCallToClient', data => {
            tracks && tracks.forEach(track => track.stop())
            if(newCall) newCall.close()
            addCallMessage(data, data.times)
            dispatch({ type: GLOBALTYPES.CALL, payload: null })
        })

        return () => socket.off('endCallToClient')
    },[socket, dispatch, tracks, addCallMessage, newCall])

    // Stream Media
    const openStream = (video) => {
        const config = { audio: true, video }
       
        return navigator.mediaDevices.getUserMedia(config)
        
    }

    const playStream = (tag, stream) => {
        let video = tag;
        video.srcObject = stream;
        //Avoid the Promise Error
        setTimeout(function () {      
            video.play();
        }, 150);
    }

    // Answer call
    const handleAnswer = () => {
        openStream(call.video).then(stream => {
            playStream(youVideo.current, stream)
            const track = stream.getTracks()
            setTracks(track)

            // Call a peer, providing our mediaStream
            const newCall = peer.call(call.peerId, stream)
            newCall.on('stream', function(remoteStream) {
                // `stream` is the MediaStream of the remote peer.
	            // Here you'd add it to an HTML video/canvas element.
                playStream(otherVideo.current, remoteStream)
            })

            setAnswer(true)
            setNewCall(newCall)
        })
    }

    useEffect(() => {
        peer.on('call', newCall => {
            openStream(call.video).then(stream => {
                if(youVideo.current) {
                    playStream(youVideo.current, stream)
                }
                const track = stream.getTracks()
                setTracks(track)

                // Answer the call, providing our mediaStream
                newCall.answer(stream)
                newCall.on('stream', function(remoteStream) {
                    if(otherVideo.current) {
                        // `stream` is the MediaStream of the remote peer.
	                    // Here you'd add it to an HTML video/canvas element.
                        playStream(otherVideo.current, remoteStream)
                    }
                })

                setAnswer(true)
                setNewCall(newCall)
            })
        })

        return () => peer.removeListener('call')
    },[peer, call.video])

    // When user other side disconnect => end Call
    useEffect(() => {
        socket.on('callerDisconnect', () => {
            tracks && tracks.forEach(track => track.stop())
            if(newCall) newCall.close()
            let times = answer ? total : 0
            addCallMessage(call, times, true)
            dispatch({type: GLOBALTYPES.CALL, payload: null})
            answer && dispatch({type: GLOBALTYPES.ALERT, payload: {error: `${call.fullname} is disconnected`}})
        })

        return () => socket.off('callerDisconnect')
    },[socket, tracks, dispatch, call, answer, addCallMessage, total, newCall])

    // Play - Pause Audio
    const playAudio = (newAudio) => {
        newAudio.play()
    }

    const pauseAudio = (newAudio) => {
        newAudio.pause()
        newAudio.currentTime = 0
    }

    useEffect(() => {
        let newAudio = new Audio(RingRing)
        
        if(answer) {
            pauseAudio(newAudio)
        } else {
            playAudio(newAudio)
        }
        return () => pauseAudio(newAudio)
    },[answer])

    return (
        <div className='call_modal'>
            <div className='call_box' style={{ display: (answer && call.video) ? 'none' : 'flex'}}>
                <div className='text-center' style={{padding: '40px 0'}}>
                    <Avatar src={call.avatar} size='supper-avatar'/>
                    <h4>{call.username}</h4>
                    <h6>{call.fullname}</h6>

                    {
                        answer ?
                        <div>
                            <span>{hours.toString().length < 2 ? '0' + hours : hours}</span>
                            <span>:</span>
                            <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
                            <span>:</span>
                            <span>{second.toString().length < 2 ? '0' + second : second}</span>
                        </div>:
                        <div>
                            {
                                call.video ?
                                <span>calling video...</span> :
                                <span>calling audio...</span> 
                            }
                        </div>
                    }
                </div>

                {
                    !answer &&
                    <div className='timer'>
                        <small>{mins.toString().length < 2 ? '0' + mins : mins}</small>
                        <small>:</small>
                        <small>{second.toString().length < 2 ? '0' + second : second}</small>
                    </div>
                }


                <div className='call_menu'>
                    <button className='material-icons text-danger'
                    onClick={handleEndCall}>
                        call_end
                    </button>

                    {
                        (call.recipient === auth.user._id && !answer) &&
                        <>
                        {
                           call.video ?
                           <button className='material-icons text-success'
                           onClick={handleAnswer}>
                               videocam
                           </button> :
                           <button className='material-icons text-success'
                           onClick={handleAnswer}>
                               call
                           </button>
                        }
                       </>
                    }
                   
                </div>
            </div>

            <div className='show_video' style={{
                opacity: (answer && call.video) ? '1' : '0',
                filter: theme ? 'invert(1)' : 'invert(0)'
            }}>
                <video ref={youVideo} className='you_video' playsInline muted/>
                <video ref={otherVideo} className='other_video' playsInline/>

                <div className='time_video'>
                    <span>{hours.toString().length < 2 ? '0' + hours : hours}</span>
                    <span>:</span>
                    <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
                    <span>:</span>
                    <span>{second.toString().length < 2 ? '0' + second : second}</span>
                </div>

                <button className='material-icons text-danger end_call'
                onClick={handleEndCall}>
                    call_end
                </button>
            </div>
        </div>
    )
}

export default CallModal
