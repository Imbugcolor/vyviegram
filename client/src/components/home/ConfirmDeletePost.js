import React, { useEffect, useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { deletePostByAdmin, reportPost } from '../../redux/actions/postAction'
import { useNavigate } from 'react-router-dom'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { AiOutlineClose } from 'react-icons/ai'

const ConfirmDeletePost = ({deleted}) => {
    const { auth, deleteModal, socket, report } = useSelector(state => state)

    const [post, setPost] = useState('')

    useEffect(() => {
        if(deleted && deleteModal.post) {
            setPost(deleteModal.post)
        } else {
            setPost(report.post)
        }
    },[deleted, deleteModal, report.post])

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const messageDelete = [
    {
        id: 1,
        msg: "It's spam"
    },
    {
        id: 2,
        msg: 'Nudity or sexual activity'
    },
    {
        id: 3,
        msg: 'Hate speech or symbols'
    },
    {
        id: 4,
        msg: 'Violence or dangerous organizations'
    },
    {
        id: 5,
        msg: 'Sale of illegal or regulated goods'
    },
    {
        id: 6,
        msg: 'Bullying or harassment'
    },
    {
        id: 7,
        msg: "Intellectual property violation"
    },
    {
        id: 8,
        msg: "Suicide' or self-injury"
    },
    {
        id: 9,
        msg: "Eating disorders"
    },
    {
        id: 10,
        msg: 'Scam or fraud'
    },
    {
        id: 11,
        msg: "False information"
    },
    ]

    const handleDeletePost = (message) => {
        if(deleted) {
            dispatch(deletePostByAdmin({message, post, auth, socket, navigate}))
        } else {
            dispatch(reportPost({message, post, auth, socket}))
        }
    }

    const handleCloseModal = () => {
        if(deleted) {
            dispatch({ type: GLOBALTYPES.ADMIN_DELETE_POST, payload: null })
        } else {
            dispatch({ type: GLOBALTYPES.REPORT_POST, payload: null })
        }
    }

    return (
        <div className='confirm__delete_modal'>
        <div className='confirm_delete__container'>
            <div className='confirm_delete__header'>
                <div className='modal_title'>
                    <span>{deleted ? 'Delete' : 'Report'}</span>
                </div>
                <div className='modal_close'>
                    <AiOutlineClose className='close_btn' onClick={handleCloseModal} />
                </div>
            </div>
            <div className='confirm_delete__body'>
                <h6 className='confirm_title'>Why are you {deleted ? 'removing' : 'reporting'} this post?</h6>
                {
                    messageDelete.map((item) => (
                        <div key={item.id} className='message__delete_option' onClick={() => handleDeletePost(item)}>
                            <span>{item.msg}</span>
                            <IoIosArrowForward />
                        </div>
                    ))
                }  
            </div>
        </div>
        </div>
    )
}

export default ConfirmDeletePost
