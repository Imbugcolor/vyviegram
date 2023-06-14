import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const UserCard = ({children, user, border, handleClose, setShowFollowers, setShowFollowing}) => {
  const handleCloseAll = () => {
    if(handleClose) handleClose()
    if(setShowFollowers) setShowFollowers(false)
    if(setShowFollowing) setShowFollowing(false)
  }
  return (
    <div className={`d-flex p-2 align-items-center justify-content-between ${border}`}>
        <div>
          <Link to={`/profile/${user._id}`} className="d-flex align-items-center"  onClick={handleCloseAll} style={{textDecoration: 'none'}}>
            <Avatar src={user.avatar} size="big-avatar"/>
            <div className="ml-2" style={{transform: 'translate(-2px)'}}>
                <span className="d-block">{user.username}</span>
                <small style={{opacity:0.7}}>{user.fullname}</small>
            </div>
          </Link>
        </div>
        {children}
    </div>
  )
}

export default UserCard