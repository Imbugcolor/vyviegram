import React from 'react'
import Avatar from '../Avatar'

const MsgDisplay = ({user}) => {
  return (
    <>
        <div className='chat_title'>
            <Avatar src={user.avatar} size='mess-avatar' />
            <span>{user.username}</span>
        </div>

        <div className='chat_text'>
            Hello, Im Chat Text Preview.
        </div>

        <div className='chat_time'>
            August 2023
        </div>
    </>
  )
}

export default MsgDisplay
