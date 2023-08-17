import React, { useState } from 'react'
import Avatar from '../../Avatar'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'
import { deletePost } from '../../../redux/actions/postAction'
import {BASE_URL} from "../../../utils/config"
import stylePopUpConfirm from '../../alert/Confirm'
import ConfirmDeletePost from '../ConfirmDeletePost'
import { BiDotsHorizontalRounded } from 'react-icons/bi'

const CardHeader = ({post}) => {
    const { auth, socket } = useSelector(state => state)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [openModal, setOpenModal] = useState(false)

    const handleEditPost = () => {
        dispatch({ type: GLOBALTYPES.STATUS, payload: {...post, onEdit: true} })
    }

    const handleDeletePost = () => {
        stylePopUpConfirm.fire({
            text: "Are you sure you want to delete this post?",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deletePost({post, auth, socket}))
                return navigate("/");
            } 
        })
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`)
    }

    return (
        <div className='card_header'>
            <div className='d-flex'>
                <Avatar src={post.user.avatar} size='big-avatar' />
                <div className='card_name ml-2'>
                    <h6 className='m-0'>
                        <Link to={`/profile/${post.user._id}`} className='text-dark'>
                            {post.user.username}
                        </Link>
                    </h6>
                    <small className='text-muted'>
                        {moment(post.createdAt).fromNow()}
                    </small>
                </div>
            </div>
            <div className='nav-item dropdown'>
                <span className='material-icons' id='moreLink' data-toggle='dropdown'>
                    <BiDotsHorizontalRounded />
                </span>
                <div className='dropdown-menu'>
                    {
                        auth.user._id === post.user._id &&
                        <>
                            <div className='dropdown-item' onClick={handleEditPost}>
                                <span className='material-icons'>create</span> Edit post
                            </div>
                            <div className='dropdown-item' onClick={handleDeletePost}>
                                <span className='material-icons'>delete_outline</span> Remove post
                            </div>
                        </>
                    }
                    {
                        auth.user.role === 'admin' && auth.user._id !== post.user._id &&
                        <div className='dropdown-item' onClick={() => setOpenModal(true)}>
                                <span className='material-icons'>
                                    delete_outline
                                </span> Remove Post
                        </div>
                    }

                    <div className='dropdown-item' onClick={handleCopyLink}> 
                        <span className='material-icons'>content_copy</span> Copy link
                    </div>
                </div>
            </div>
            {
                openModal && 
                <ConfirmDeletePost 
                    setOpenPopup={setOpenModal} 
                    post={post} 
                    auth={auth} 
                    socket={socket}
                />
            }
        </div>
    )
}

export default CardHeader
