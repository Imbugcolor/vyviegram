import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/config' 
import { useDispatch, useSelector } from 'react-redux'
import { getDataAPI } from '../utils/fetchData'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import Avatar from './Avatar'
import LoadIcon from '../images/loading.gif'
import {
  EmailShareButton, EmailIcon,
  FacebookShareButton, FacebookIcon,
  TelegramShareButton, TelegramIcon,
  TwitterShareButton, TwitterIcon,
  WhatsappShareButton, WhatsappIcon,
  RedditShareButton, RedditIcon
} from 'react-share'
import { shareToMess } from '../redux/actions/messageAction'



const ShareModal = () => {
     const { auth, theme, share, socket } = useSelector(state => state)
     const url = `${BASE_URL}/post/${share.post._id}`

     const dispatch = useDispatch()
     const [load, setLoad] = useState(false)

     const [search, setSearch] = useState('')
     const [users, setUsers] = useState([])
     const [userChosen, setUserChosen] = useState([])
     const [shareMsg, setShareMsg] = useState('')

     const handleClose = () => {
          setSearch('')
          setUsers([])
          setUserChosen([])
          dispatch({ type: GLOBALTYPES.SHARE, payload: false })
     }

     // Suggest users following to share
     useEffect(() => {
          setUsers(auth.user.following)
     },[auth.user.following])

     // Debounce search
     useEffect(() => {
          const delayDebounce = setTimeout(async() => {
               if(!search) {
                    return setUsers(auth.user.following)
               }

               setLoad(true)
               
               try {
                    const res = await getDataAPI(`search?username=${search}`, auth.token)
                    setUsers(res.data.users)
               } catch (err) {
                    dispatch({
                         type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}
                    })
               }
              
               setLoad(false)

          }, 400)

          return () => clearTimeout(delayDebounce)

     },[search, auth.token, dispatch, auth.user.following])

     // Handle check user to share
     const handleUserCheckbox = e => {
          const { value, checked, name } = e.target
   
          if (checked) {
               setUserChosen([...userChosen, {_id: value, username: name}])
          } else {
               setUserChosen(userChosen.filter((item) => item._id !== value ))
          }
     }

     // Remove user checked
     const handleDeleteResult = (id) => {
          setUserChosen(userChosen.filter((item) => item._id !== id ))
     }

     // Share
     const handleSend = async () => {
          await dispatch(shareToMess({post: share.post, usersShare: userChosen, shareMsg, auth, socket}))

          setSearch('')
          setUsers(auth.user.following)
          setUserChosen([])   
     }


     return (
          <div className='share_modal'>
               <div className='share_box'>
                    <div className='new__header'>
                    <span className='title__header'>Share</span>
                    <span className='new__close_btn' onClick={handleClose}>&times;</span>
                    </div>
                    <div className='search__new'>
                         <label htmlFor='newMsgSearch'>To:</label>
                         {
                              userChosen.length > 0 &&
                              userChosen.map(item => (
                                   <div key={item._id} className='result__input'>
                                        <span className='result__input_name'>{item.username}</span>
                                        <span className='close_result' onClick={() => handleDeleteResult(item._id)}>&times;</span>
                                   </div>
                              ))
                         }
                         
                         <input type='text' name='newMsgSearch' id='newMsgSearch' value={search} 
                              placeholder='Search...'
                              onChange={e => setSearch(e.target.value.replace(/ /g, ''))}/>
                    </div>

                    <div className='search__new_container'>
                         {
                         load ? 
                         <div className='load__search'>
                              <img src={LoadIcon} alt='loading'/>
                         </div> :
                    
                         <div className='search__new_result'>
                              <h6 style={{ padding: '0 25px', color: '#666666' }}>Suggested</h6>
                              {
                                   users.length ?
                                   users.map(user => (
                                        <div className='search__item_result' key={user._id} style={{background: `${userChosen._id === user._id ? '#efefef' : '#fff'}`}}>
                                             <label className='d-flex align-item-center' htmlFor={user._id} style={{cursor: 'pointer'}}>
                                                  <Avatar src={user.avatar} size='big-avatar'/>
                                                  <div className='ml-2' style={{transform: 'translateY(-2px)'}}>
                                                       <span className='d-block' style={{color: '#262626', fontWeight: '500'}}>{user.username}</span>
                                                  
                                                       <small style={{ color: '#666666'}}>
                                                            {user.fullname}
                                                       </small>
                                                  </div>
          
                                                  <div className="user-check">
                                                       <input type="checkbox" 
                                                            name={user.username} 
                                                            id={user._id} 
                                                            value={user._id}                                          
                                                            onChange={handleUserCheckbox} 
                                                            checked={userChosen.some(item => item._id === user._id)} 
                                                       />
                                                  </div>
                                             </label>
                                        </div>
                                   ))
                                   : <div className='text-center'>
                                        <span>No Result</span>
                                   </div>
                              }
                         </div>
                         }
                    </div>

                    <div className='share__social_media d-flex justify-content-between px-4 py-2'
                         style={{filter: theme ? 'invert(1)':'invert(0)'}
                    }>
                         <FacebookShareButton url={url}>
                              <FacebookIcon round={true} size={32} />
                         </FacebookShareButton>

                         <TwitterShareButton url={url}>
                              <TwitterIcon round={true} size={32} />
                         </TwitterShareButton>

                         <EmailShareButton url={url}>
                              <EmailIcon round={true} size={32} />
                         </EmailShareButton>

                         <RedditShareButton url={url}>
                              <RedditIcon round={true} size={32} />
                         </RedditShareButton>

                         <TelegramShareButton url={url}>
                              <TelegramIcon round={true} size={32} />
                         </TelegramShareButton>

                         <WhatsappShareButton url={url}>
                              <WhatsappIcon round={true} size={32} />
                         </WhatsappShareButton>
                    </div>

                    {
                         userChosen.length > 0 &&
                         <div>
                              <input type='text' name='share-message' placeholder='Write a message...' value={shareMsg} onChange={(e) => setShareMsg(e.target.value)}/>
                         </div>
                    }

                    <div className='new__footer'>
                    <button className='new__chat_btn' disabled={userChosen.length === 0} style={{opacity: `${userChosen.length > 0 ? 1 : 0.5}`}}
                    onClick={handleSend}>Send</button>
                    </div>
              
               </div>
                     
          </div>
     )
}

export default ShareModal
