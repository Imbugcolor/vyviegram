import React, { useState } from 'react'
import LeftSide from '../../components/message/LeftSide'
import { RiMessengerLine } from 'react-icons/ri'
import NewMessenger from '../../components/message/NewMessenger'

const Message = () => {
  const [openNewMsg, setOpenNewMsg] = useState(false)
  return (
    <div className='message d-flex'>
      <div className='col-md-3 border-right px-0'>
        <LeftSide />
      </div>

      <div className='col-md-9 px-0 right_mess'>
            <div className='d-flex justify-content-center
             align-items-center flex-column h-100 right_mess'>
                <RiMessengerLine 
                style={{fontSize: '5rem'}} 
                />
                <h4 style={{fontWeight: 'normal', marginTop: '15px'}}>Your messages</h4>
                <span>Send private photos and messages to a friend</span>
                <button className='new__msg_btn' onClick={() => setOpenNewMsg(true)}>Send message</button>
            </div>
      </div>

      {
          openNewMsg && <NewMessenger setOpenNewMsg={setOpenNewMsg}/>
      }
    </div>
  )
}

export default Message
