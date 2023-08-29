import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCardHover } from '../../../redux/actions/cardHoverAction'
import { MESS_TYPES } from '../../../redux/actions/messageAction'
import Avatar from '../../Avatar'
import Video from '../../Video'
import FollowBtn from '../../FollowBtn'
import { SiAdguard } from 'react-icons/si'
import { RiMessengerLine } from 'react-icons/ri'

const CardHover = ({user}) => {
    const {cardHover, auth, theme, online} = useSelector(state=> state)
    const [posts, setPosts] = useState([])
    const [totalResults, setTotalResults] = useState(0);
    const dispatch = useDispatch()

    const navigate = useNavigate()
  
    useEffect(() => {
      if(cardHover.ids.every(item => item !== user._id))
    {
        dispatch(getCardHover({id: user._id, auth}))
    }
    },[auth, user._id, dispatch, cardHover.ids]);

    useEffect(() => {
       const data = cardHover.posts.find(data => 
            data._id === user._id
        )
        if(data){
            setPosts(data.posts)
            setTotalResults(data.totalResults)
          
        }
    },[cardHover.posts, user._id])

    const handleAddMessage = () => {
        dispatch({type: MESS_TYPES.ADD_USER, payload: {...user, text: '', media: []}})
        dispatch({type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online})
        return navigate(`/message/${user._id}`)
    }

  return (
    <div className="card-hover animated">
        <div className="card-hover-info">
            <Avatar src={user.avatar} size='big-avatar' />
            <div className="card-hover-name">
                <div className="card-hover-username">
                    <Link to={`/profile/${user._id}`} className='text-dark d-flex align-items-center'>
                        <span style={{color: 'rgb(38, 38, 38)', fontWeight: '500'}}>{user.username}</span>
                        {
                            user.role === 'admin' &&
                            <span style={{ marginLeft: '8px', fontSize: '14px', color: '#007bff' }}><SiAdguard  /></span>
                            
                        }
                       
                    </Link>
                </div>
                <div className="card-hover-fullname">
                   <small style={{color: 'rgb(102, 102, 102)'}}>{user.fullname}</small> 
                </div>
            </div>
        </div>
        <div className="card-hover-follow">
            <div className="card-hover-item">
                <span >{totalResults}</span>
                <p>posts</p>
            </div>
            <div  className="card-hover-item">
                <span>{user.followers.length}</span>
                <p>followers</p>
            </div>
            <div  className="card-hover-item">
                <span>{user.following.length}</span>
                <p>following</p>
            </div>
        </div>
        <div className="card-hover-postthumb d-flex align-items-center">
            {posts.slice(0,3).map(post => (
                <Link key={post._id} to={`/post/${post._id}`}>
                    <div className='card_hover_post_thumb_display'>
                        {
                            post.images[0].url.match(/video/i)
                            ?
                            <Video public_id={post.images[0].public_id}/>
                            :   
                            <img src={post.images[0].url} alt={post.images[0].url}
                                     style={{filter: theme ? 'invert(1)' : 'invert(0)'}}/>
                        }
                    </div>
                </Link>
            ))}
        </div>
        <div className="card-hover-contact">
            {
                user._id === auth.user._id ? 
                <Link className='edit__profile_btn' to={'/edit'}>
                    Edit profile
                </Link> :
                <>  
                    <div className="card-hover-message d-flex align-items-center" onClick={handleAddMessage} style={{ cursor: 'pointer' }}> 
                        <RiMessengerLine style={{ marginRight: '5px' }}/> Message
                    </div>
                    <div className="card-hover-following"><FollowBtn user={user}/></div>
                </>
                
            }
            
            
        </div>
    </div>
  )
}

export default CardHover
