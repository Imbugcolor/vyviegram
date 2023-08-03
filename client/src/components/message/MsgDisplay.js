import React from 'react'
import Avatar from '../Avatar'
import { imageShow, videoShow } from '../../utils/mediaShow'
import { useSelector } from 'react-redux'

const MsgDisplay = ({user, msg, theme}) => {
  const { auth } = useSelector(state => state)
  return (
    <>
        <div className={`chat_title ${user._id === auth.user._id && 'flex-row-reverse'}`}>
          <Avatar src={user.avatar} size='mess-avatar' />

          <div style={{margin: '0 7px'}}>
              <div className='you_content' style={{float: `${user._id === auth.user._id ? 'right' : 'left'}`}}>
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
                </div>
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
