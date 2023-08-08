import React from 'react'
import Avatar from '../Avatar'
import { imageShow, videoShow } from '../../utils/mediaShow'
import { useDispatch, useSelector } from 'react-redux'
import stylePopUpConfirm from '../alert/Confirm'
import { deleteMessages } from '../../redux/actions/messageAction'
import { Link } from 'react-router-dom'
import Times from './Times'
import Video from '../Video'

const MsgDisplay = ({user, msg, theme, data}) => {
  const { auth, socket } = useSelector(state => state)
  const dispatch = useDispatch()

  const handleDeleteMessages = () => {
    if(!data) return;
    stylePopUpConfirm.fire({
        text: "Delete message?",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteMessages({msg, data, auth, socket}))
        } 
    })
  }
  return (
    <>
        <div className={`chat_title ${user._id === auth.user._id && 'flex-row-reverse'}`}>
          <Avatar src={user.avatar} size='mess-avatar' />

          <div style={{margin: '0 7px'}}>
              <div className='you_content' style={{float: `${user._id === auth.user._id ? 'right' : 'left'}`}}>
                  { 
                    user._id === auth.user._id && 
                    <span className='unsend_msg' onClick={handleDeleteMessages}> Unsend </span>
                  }
                <div>
                  { 
                    msg.text && 
                    <div className='chat_text' 
                    style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>
                      { msg.text }
                    </div>
                  }

                  {
                    msg.media.map((item, index) => (
                      <div key={index}>
                        {
                          item.url.match(/video/i) ?
                          videoShow(item.url, theme) :
                          imageShow(item.url, theme)
                        }
                      </div>
                    ))
                  }

                  {
                    msg.share && 
                    <Link to={`/post/${msg.share._id}`} style={{textDecoration: 'none', color: '#000'}}>
                      <div className='share_msg'>
                          <div className='share__msg_header'>
                              <Avatar src={msg.share.user.avatar} size='medium-avatar' alt='avatar'/>
                              <span className='ml-2'>{msg.share.user.username}</span>
                          </div>
                          <div>
                            {
                              msg.share.images[0].url.match(/video/i) ?
                              <Video public_id={msg.share.images[0].public_id}/>
                              : <img src={msg.share.images[0].url} alt='images' 
                                  style={{filter:  theme ? 'invert(1)' : 'invert(0)', maxWidth: '100%', height: 'auto', objectFit: 'cover', verticalAlign: 'middle'}}
                                />
                            }
                          </div>
                          <div className='content__share'>
                              <p>{msg.share.content.length < 150 ? msg.share.content : msg.share.content.slice(0, 150) + '...'}</p>
                          </div>
                      </div>
                    </Link>
                  }
                </div>

                  {
                    msg.call &&
                    <button className='btn d-flex align-items-center py-3'
                    style={{background: '#eee', borderRadius: '10px'}}>
                        <span className='material-icons font-weight-bold mr-1'
                        style={{ fontSize: '2.5rem', color: msg.call.times === 0 ? 'crimson' : 'green',
                        filter:  theme ? 'invert(1)' : 'invert(0)'}}>
                          {
                            msg.call.times === 0 ?
                            msg.call.video ? 'videocam_off' : 'phone_disabled' :
                            msg.call.video ? 'video_camera_front' : 'call'
                          }
                        </span>

                        <div className='text-left'>
                            <h6>
                              {
                                msg.call.times === 0 ?
                                msg.call.video ? 'Missed video call' : 'Missed audio call' :
                                msg.call.video ? 'Video call ended' : 'Audio call ended'
                              }
                            </h6>
                            <small>
                                {
                                  msg.call.times > 0 ?
                                  <Times total={msg.call.times}/> :
                                  new Date(msg.createdAt).toLocaleTimeString()
                                }
                            </small>
                        </div>
                    </button>
                  }
              </div>

              <div className='chat_time' style={{textAlign: `${user._id === auth.user._id ? 'end' : 'start'}`}}>
                  { new Date(msg.createdAt).toLocaleString() }
              </div>
          </div>
        </div>
    </>
  )
}

export default MsgDisplay
