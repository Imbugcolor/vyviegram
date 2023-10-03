import React from 'react'
import Avatar from '../../Avatar'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'
import { deletePost } from '../../../redux/actions/postAction'
import {BASE_URL} from "../../../utils/config"
import stylePopUpConfirm from '../../alert/Confirm'
import { BiDotsHorizontalRounded, BiEditAlt } from 'react-icons/bi'
import { SiAdguard } from 'react-icons/si'
import { BsFlag } from 'react-icons/bs'
import { IoMdCopy, IoIosRemoveCircleOutline } from 'react-icons/io'
import { FiTrash } from 'react-icons/fi'
import CardHover from './CardHover'

const CardHeader = ({post}) => {
    
    const { auth, socket } = useSelector(state => state)
    const dispatch = useDispatch()
    const navigate = useNavigate()

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

    const handleDeletePostByAdmin = () => {
        dispatch({ type: GLOBALTYPES.ADMIN_DELETE_POST, payload: { post }})
    }

    const handleReportPost = () => {
        dispatch({ type: GLOBALTYPES.REPORT_POST, payload: post})
    }

    return (
        <div className='card_header'>
            <div className='d-flex card-hover-active'>
                <Avatar src={post.user.avatar} size='big-avatar' />
                <div className='card_name ml-2'>
                    <h6 className='m-0'>
                        <Link to={`/profile/${post.user._id}`} className='card-username text-dark d-flex align-items-center'>
                            {post.user.username}
                            {
                                post.user.role === 'admin' &&
                                <span style={{ marginLeft: '8px', fontSize: '14px', color: '#007bff' }}><SiAdguard /></span>
                            }
                        </Link>
                    </h6>
                    <small className='text-muted'>
                        {moment(post.createdAt).fromNow()}
                    </small>
                    <CardHover user={post.user}/>
                </div>
            </div>
            <div className='nav-item dropdown'>
                <span className='material-icons' id='moreLink' data-toggle='dropdown' style={{ cursor: 'pointer' }}>
                    <BiDotsHorizontalRounded />
                </span>
                <div className='dropdown-menu'>
                    {
                        auth.user._id === post.user._id &&
                        <>
                            <div className='dropdown-item' onClick={handleEditPost}>
                                <BiEditAlt /> <span className='ml-2'>Edit</span>
                            </div>
                            <div className='dropdown-item' onClick={handleDeletePost}>
                                <FiTrash /> <span className='ml-2'>Remove</span>
                            </div>
                        </>
                    }
                    {
                        auth.user.role === 'admin' && auth.user._id !== post.user._id &&
                        <div className='dropdown-item' onClick={handleDeletePostByAdmin}>
                                <IoIosRemoveCircleOutline /> <span className='ml-2'>Remove</span>
                        </div>
                    }

                    <div className='dropdown-item' onClick={handleCopyLink}> 
                        <IoMdCopy /> <span className='ml-2'>Copy Link</span>
                    </div>

                    {
                        auth.user.role !== 'admin' && auth.user._id !== post.user._id &&
                        <div className='dropdown-item' onClick={handleReportPost}> 
                            <BsFlag /> <span className='ml-2'>Report</span>
                        </div>
                    }
                </div>
            </div>
        
        </div>
    )
}

export default CardHeader
