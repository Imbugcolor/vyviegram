import React, { useEffect, useState } from 'react'
import Send from '../../../images/send.svg'
import { Link } from 'react-router-dom'
import LikeButton from '../../LikeButton'
import { useDispatch, useSelector } from 'react-redux'
import { likePost, savePost, unSavePost, unlikePost } from '../../../redux/actions/postAction'
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'

const CardFooter = ({post}) => {
    const [isLike, setIsLike] = useState(false)
    const [loadLike, setLoadLike] = useState(false)
    const {auth, socket} = useSelector(state => state)
    const [saved, setSaved] = useState(false)
    const [saveLoad, setSaveLoad] = useState(false)

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
                <div>
                   <LikeButton isLike={isLike}
                   handleLike={handleLike}
                   handleUnLike={handleUnLike}
                   />

                    <Link to={`/post/${post._id}`} className='text-dark' >
                        <i className='far fa-comment' />
                    </Link>

                    <img src={Send} alt="Send" onClick={handleSharePost} />
                </div>

                {
                    saved 
                    ?  <i className="fas fa-bookmark text-info"
                    onClick={handleUnSavePost} />

                    :  <i className="far fa-bookmark"
                    onClick={handleSavePost} />
                }
            </div>

            <div className='d-flex justify-content-between'>
                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                    {post.likes.length} likes
                </h6>

                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                    {post.comments.length} comments
                </h6>
            </div>
        </div>
    )
}

export default CardFooter
