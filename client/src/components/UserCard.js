import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SiAdguard } from 'react-icons/si'

const UserCard = ({children, user, border, handleClose, setShowFollowers, setShowFollowing, setShowLikes, msg}) => {
  
  const { theme, auth } = useSelector(state => state)
  // console.log(children)
  // console.log(user)
  const handleCloseAll = () => {
    if(handleClose) handleClose()
    if(setShowFollowers) setShowFollowers(false)
    if(setShowFollowing) setShowFollowing(false)
    if(setShowLikes) setShowLikes(false)
  }

  const showMsg = (user) => {
    return (
      <>
        <div style={{ filter: theme ? 'invert(1)' : 'invert(0)', fontWeight: user.sender !== auth.user._id && !user.isRead ? 'bold' : 'normal' }}>
          {
            user.sender === auth.user._id && 'You: '
          }
          {
            user.text && user.text.length > 60 ? user.text.slice(0,60) + '...' : user.text
          }
        </div>
        { 
          user.media.length > 0 && 
          <div>
            {user.media.length} <i className='fas fa-image'/>
          </div>
        }

        {
          user.call &&
          <span className='material-icons'>
            {
              user.call.times === 0 ?
              user.call.video ? 'videocam_off' : 'phone_disabled' :
              user.call.video ? 'video_camera_front' : 'call'
            }
          </span>
        }

        {
          user.share &&
          <span style={{fontStyle: 'italic'}}>share a post...</span>
        }
      </>
    )
  }

  return (
    <div className={`user_card d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>
        <div className="card-hover-usercard">
          <Link to={`/profile/${user._id}`} className="d-flex align-items-center"  onClick={handleCloseAll} style={{textDecoration: 'none'}}>
            <Avatar src={user.avatar} size="big-avatar"/>
            <div className="ml-2" style={{transform: 'translate(-2px)'}}>
                <span className="d-flex align-items-center" style={{color: '#262626', fontWeight: '500'}} >
                  {user.username.length > 13 ? user.username.slice(0,13) + '...' : user.username}
                  {
                    user.role === 'admin' &&
                    <span><SiAdguard style={{ marginLeft: '5px', fontSize: '14px', color: '#007bff' }}/></span>
                  }
                </span>
                <small className='d-flex align-items-center' style={{ color: '#666666'}} >
                  {
                    user.typing ? <div style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>{user.fullname} is typing...</div> :
                    msg ? showMsg(user) : user.fullname
                  }
                </small>
            </div>
          </Link>
          
        </div>
        {children}
    </div>
  )
}

export default UserCard