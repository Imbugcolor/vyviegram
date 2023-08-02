import React from 'react'
import LeftSide from '../../components/message/LeftSide'
import { RiMessengerLine } from 'react-icons/ri'

const Message = () => {
  return (
    <div className='message d-flex'>
      <div className='col-md-4 border-right px-0'>
        <LeftSide />
      </div>

      <div className='col-md-8 px-0 right_mess'>
            <div className='d-flex justify-content-center
             align-items-center flex-column h-100 right_mess'>
                <RiMessengerLine 
                style={{fontSize: '5rem'}} 
                />
                <h4 style={{fontWeight: 'normal', marginTop: '15px'}}>Your messages</h4>
                <span>Send private photos and messages to a friend</span>
                <button className='new__msg_btn'>Send message</button>
            </div>
      </div>
    </div>
  )
}

export default Message
