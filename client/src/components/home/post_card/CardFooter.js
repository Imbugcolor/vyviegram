import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LikeButton from '../../LikeButton'
import { useDispatch, useSelector } from 'react-redux'
import { likePost, savePost, unSavePost, unlikePost } from '../../../redux/actions/postAction'
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'
import Likes from '../Likes'
import { TbSend } from 'react-icons/tb'

const CardFooter = ({post}) => {
    const [isLike, setIsLike] = useState(false)
    const [loadLike, setLoadLike] = useState(false)
    const {auth, socket} = useSelector(state => state)
    const [saved, setSaved] = useState(false)
    const [saveLoad, setSaveLoad] = useState(false)
    const [showLikes, setShowLikes] = useState(false)

    const dispatch = useDispatch()

    // Likes
    useEffect(() => {
        if(post.likes.find(like => like._id === auth.user._id)){
            setIsLike(true)
        }else{
            setIsLike(false)
        }
    }, [post.likes, auth.user._id])

    const handleLike = async () => {
        if(loadLike) return;
        
        setLoadLike(true)
        await dispatch(likePost({post, auth, socket}))
        setLoadLike(false)
    }

    const handleUnLike = async() => {
        if(loadLike) return;

        setLoadLike(true)
        await dispatch(unlikePost({post, auth, socket}))
        setLoadLike(false)
    }

    // Save
    useEffect(() => {
        if(auth.user.saved.find(id => id === post._id)){
            setSaved(true)
        }else{
            setSaved(false)
        }
    },[auth.user.saved, post._id])

    const handleSavePost = async () => {
        if(saveLoad) return;
        
        setSaveLoad(true)
        await dispatch(savePost({post, auth}))
        setSaveLoad(false)
    }

    const handleUnSavePost = async () => {
        if(saveLoad) return;

        setSaveLoad(true)
        await dispatch(unSavePost({post, auth}))
        setSaveLoad(false)
    }

    // Share 
    const handleSharePost = () => {
        dispatch({ type: GLOBALTYPES.SHARE, payload: { post }})
    }

    return (
        <div className='card_footer'>
            <div className='card_icon_menu'>
                <div className='d-flex align-items-center'>
                   <LikeButton isLike={isLike}
                   handleLike={handleLike}
                   handleUnLike={handleUnLike}
                   />

                    <Link to={`/post/${post._id}`} className='text-dark' >
                        <i className='far fa-comment' />
                    </Link>

                    <TbSend onClick={handleSharePost} />
                </div>

                {
                    saved 
                    ?  <i className="fas fa-bookmark" style={{ color: '#000' }}
                    onClick={handleUnSavePost} />

                    :  <i className="far fa-bookmark"
                    onClick={handleSavePost} />
                }
            </div>

            <div className='d-flex justify-content-between'>
                {
                    post.likes.length > 0 ?
                    <h6 style={{padding: '0 25px', cursor: 'pointer'}} onClick={() => setShowLikes(true)}>
                        {post.likes.length} likes
                    </h6> :
                    <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                        {post.likes.length} likes
                    </h6>
                }

                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                    {post.comments.length} comments
                </h6>
            </div>

            {
                  showLikes &&
                  <Likes 
                  users={post.likes} 
                  setShowLikes={setShowLikes} 
                  />
            }
        </div>
    )
}

export default CardFooter
